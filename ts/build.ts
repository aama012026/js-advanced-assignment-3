// FETCH REQUIRED DOTACONSTANTS RESOURCES -> MAP TO CUSTOM DATASTRUCTURES -> WRITE TO ASSETS
const CDN_HOST = 'https://cdn.steamstatic.com/'
const HEROES_URL = new URL('https://raw.githubusercontent.com/odota/dotaconstants/refs/heads/master/build/heroes.json')
const ITEM_IDS_URL = new URL('https://raw.githubusercontent.com/odota/dotaconstants/refs/heads/master/build/item_ids.json')

const ITEM_ID_BINDINGS_PATH = './build/assets/json/itemIdBindings.json'

import type { DotaConstantsHero } from './types/DotaConstantsTypes.js'
import { formatHero, type IdBinding } from './bindings.js'
import { tryGetImg, tryWriteImg, tryWriteJSON, assert, tryGetJson, tryReadJSON } from './flow.js'

const heroErrors: Error[] = []
const imgErrors: string[] = []
// Heroes
const heroResult = await tryGetJson<Record<string, DotaConstantsHero>>(HEROES_URL)
if(heroResult.ok) {
	// Hero data
	const rawHeroes = Object.values(assert(heroResult.data, 'heroResult.data', 'Could not unpack rawHeroes'))
	const formattedHeroes = rawHeroes.map(hero => formatHero(hero))
	const err = await tryWriteJSON('.build/assets/json/heroes.json', formattedHeroes)
	if(err) {
		heroErrors.push(err)
	}

	// Hero images
	rawHeroes.forEach(async hero => {
		const img = await tryGetImg(new URL(hero.img, CDN_HOST))
		if(!img.ok) {
			imgErrors.push(img.msg!)
		}
		await tryWriteImg(`./build/assets/img/hero/${hero.name}.png`, Buffer.from(assert(img.data, 'img.data', 'Could not convert to buffer')))
	});
}

const itemIdsResult = await tryGetJson<Record<string, string>>(ITEM_IDS_URL)
if(itemIdsResult.ok) {
	const itemIds = assert(itemIdsResult.data, 'itemIdsResult.data', 'Could not unpack item IDs')
	const currentItemIdBindingsResult = await tryReadJSON<IdBinding<number>[]>(ITEM_ID_BINDINGS_PATH)
	let itemIdBindings: IdBinding<number>[] = currentItemIdBindingsResult.data ?? []
	const itemIdKeysByExtKey = Object.fromEntries(
		itemIdBindings.map(itemId => [itemId.extId, itemId.key])
	) as Record<number, number>
	let newItemIdBindings = Object.fromEntries(Object.entries(itemIds)).map(([k, v]) => {
		const internalKey = itemIdKeysByExtKey[k]
		if(itemIdBindings[itemIdKeysByExtKey[k]].label === v) {
			return {key: }
		}
	})
}