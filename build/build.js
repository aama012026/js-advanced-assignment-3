// FETCH REQUIRED DOTACONSTANTS RESOURCES -> MAP TO CUSTOM DATASTRUCTURES -> WRITE TO ASSETS
const CDN_HOST = 'https://cdn.steamstatic.com/';
const HEROES_URL = new URL('https://raw.githubusercontent.com/odota/dotaconstants/refs/heads/master/build/heroes.json');
const ITEM_IDS_URL = new URL('https://raw.githubusercontent.com/odota/dotaconstants/refs/heads/master/build/item_ids.json');
const ABILITY_IDS_URL = new URL('https://raw.githubusercontent.com/odota/dotaconstants/refs/heads/master/build/ability_ids.json');
const HERO_ID_BINDINGS_PATH = './build/assets/json/heroIdBindings.json';
const ITEM_ID_BINDINGS_PATH = './build/assets/json/itemIdBindings.json';
const ABILITY_ID_BINDINGS_PATH = './build/assets/json/abilityIdBindings.json';
import { tryGetImg, assert, tryGetJson } from './modules/flow.js';
import { tryReadJSON, tryWriteImg, tryWriteJSON } from './modules/flowLocal.js';
const heroErrors = [];
const imgErrors = [];
// Heroes
const heroResult = await tryGetJson(HEROES_URL);
if (heroResult.ok) {
    // Get hero data
    const rawHeroes = Object.values(assert(heroResult.data, 'heroResult.data', 'Could not unpack rawHeroes'));
    const newHeroIds = Object.fromEntries(rawHeroes.map(hero => [hero.id, hero.name]));
    await tryUpdateNumericIdBindings(newHeroIds, HERO_ID_BINDINGS_PATH);
    // Format Heroes to our bound shape.
    const heroIdsResult = await tryReadJSON(HERO_ID_BINDINGS_PATH);
    if (!heroIdsResult.ok) {
        console.error(`Failed to open new HeroId bindings: ${heroIdsResult.msg}`);
    }
    const heroIds = heroIdsResult.data;
    const heroKeysByExtId = Object.fromEntries(heroIds.map(hero => [hero.extId, hero.key]));
    const formattedHeroes = rawHeroes.map(hero => formatHero(hero, heroKeysByExtId));
    const err = await tryWriteJSON('build/assets/json/heroes.json', formattedHeroes);
    if (err) {
        heroErrors.push(err);
    }
    // get hero images
    rawHeroes.forEach(async (hero) => {
        const img = await tryGetImg(new URL(hero.img, CDN_HOST));
        if (!img.ok) {
            imgErrors.push(img.msg);
        }
        await tryWriteImg(`./build/assets/img/hero/${hero.name}.png`, Buffer.from(assert(img.data, 'img.data', 'Could not convert to buffer')));
    });
}
// Items
const itemIdsResult = await tryGetJson(ITEM_IDS_URL);
if (itemIdsResult.ok) {
    const newItemIds = assert(itemIdsResult.data, 'itemIdsResult.data', 'Could not unpack item IDs');
    await tryUpdateNumericIdBindings(newItemIds, ITEM_ID_BINDINGS_PATH);
}
const abilityIdsResult = await tryGetJson(ABILITY_IDS_URL);
if (abilityIdsResult.ok) {
    const newAbilityIds = assert(abilityIdsResult.data, 'abilityIdsResult.data', 'Could not unpack ability IDs');
    await tryUpdateNumericIdBindings(newAbilityIds, ABILITY_ID_BINDINGS_PATH);
}
async function tryUpdateNumericIdBindings(newIds, oldBindingsFile) {
    const messages = [];
    const warnings = [];
    const oldBindingsResult = await tryReadJSON(oldBindingsFile);
    const oldBindings = oldBindingsResult.data ?? [];
    const newBindings = [];
    let nextKey = 0;
    const assignedKeys = new Set();
    const reservedKeys = new Set(Object.keys(newIds).map(k => parseInt(k)));
    function getNextAvailableKey() {
        const unavailableKeys = assignedKeys.union(reservedKeys);
        while (unavailableKeys.has(nextKey)) {
            nextKey++;
        }
        return nextKey;
    }
    const existingByExtId = new Map();
    const existingByLabel = new Map();
    const duplicateErrors = [];
    oldBindings.forEach(b => {
        let error = false;
        let errorMsg = `Existing bindings have duplicate entries:`;
        if (existingByLabel.has(b.label)) {
            error = true;
            errorMsg += `\n${b.label} in ${JSON.stringify(b)} and ${JSON.stringify(existingByLabel.get(b.label))}`;
        }
        if (existingByExtId.has(b.extId)) {
            error = true;
            errorMsg += `\n${b.extId} in ${JSON.stringify(b)} and ${JSON.stringify(existingByExtId.get(b.extId))}}`;
        }
        if (assignedKeys.has(b.key)) {
            error = true;
            errorMsg += `\n${b.key} in ${JSON.stringify(b)}`;
        }
        if (error) {
            duplicateErrors.push(errorMsg);
        }
        else {
            existingByExtId.set(b.extId, b);
            existingByLabel.set(b.label, b);
            assignedKeys.add(b.key);
        }
    });
    if (duplicateErrors.length > 0) {
        throw new Error(duplicateErrors.join('\n'));
    }
    for (const [extIdString, label] of Object.entries(newIds)) {
        // keys are always strings in js / json, we need to convert to number for ts-typing
        const extId = parseInt(extIdString);
        const oldBindingByNewLabel = existingByLabel.get(label);
        const oldBindingByNewExtId = existingByExtId.get(extId);
        // If label exist -> assign id to existing <key, label> pair.
        if (oldBindingByNewLabel) {
            if (oldBindingByNewLabel.extId != extId) {
                warnings.push(`External id for label ${label} changed from ${oldBindingByNewLabel.extId} to ${extId}.`);
            }
            const updatedBinding = {
                key: oldBindingByNewLabel.key,
                label: label,
                extId: extId
            };
            newBindings.push(updatedBinding);
            assignedKeys.add(updatedBinding.key);
        }
        // Else -> assign label to new key, preferably equal to id.
        else {
            const updatedBinding = {
                key: assignedKeys.has(extId) ? getNextAvailableKey() : extId,
                label: label,
                extId: extId
            };
            newBindings.push(updatedBinding);
            assignedKeys.add(updatedBinding.key);
            if (oldBindingByNewExtId) {
                warnings.push(`External id for new label ${label} was already bound: ${JSON.stringify(oldBindingByNewExtId)}.`);
            }
            else {
                messages.push(`added new binding ${JSON.stringify(updatedBinding)}`);
            }
        }
    }
    const newBindingsExtIds = new Set(newBindings.map(binding => binding.extId));
    const newBindingsKeys = new Set(newBindings.map(binding => binding.key));
    oldBindings.forEach(binding => {
        if (!newBindingsKeys.has(binding.key)) {
            const deprecatedBinding = {
                key: binding.key,
                label: binding.label,
                extId: newBindingsExtIds.has(binding.extId) ? -1 : binding.extId
            };
            newBindings.push(deprecatedBinding);
            warnings.push(`Transferred old binding ${JSON.stringify(deprecatedBinding)}, which was not present in new dataset.`);
        }
    });
    const error = await tryWriteJSON(oldBindingsFile, newBindings);
    if (error) {
        throw error;
    }
    console.log(messages.join('\n'));
    console.warn(warnings.join('\n'));
}
function formatHero(rawHero, keysByExtId) {
    return {
        id: keysByExtId[rawHero.id],
        name: {
            static: rawHero.name,
            localized: rawHero.localized_name
        },
        roles: rawHero.roles,
        baseHealth: {
            size: rawHero.base_health,
            regen: rawHero.base_health_regen
        },
        baseMana: {
            size: rawHero.base_mana,
            regen: rawHero.base_mana_regen
        },
        baseArmor: rawHero.base_armor,
        baseMagicResist: rawHero.base_mr,
        baseAttack: {
            damage: {
                min: rawHero.base_attack_min,
                max: rawHero.base_attack_max
            },
            speed: rawHero.base_attack_time,
            rate: rawHero.attack_rate,
            point: rawHero.attack_point,
            range: rawHero.attack_range,
            projectile_speed: rawHero.projectile_speed
        },
        attributes: {
            primary: rawHero.primary_attr,
            base: {
                strength: rawHero.base_str,
                agility: rawHero.base_agi,
                intelligence: rawHero.base_int
            },
            gain: {
                strength: rawHero.str_gain,
                agility: rawHero.agi_gain,
                intelligence: rawHero.int_gain
            }
        },
        movement: {
            speed: rawHero.move_speed,
            turnRate: rawHero.turn_rate
        },
        vision: {
            day: rawHero.day_vision,
            night: rawHero.night_vision
        },
        legs: rawHero.legs,
        isInCaptainsMode: rawHero.cm_enabled
    };
}
//# sourceMappingURL=build.js.map