// FETCH REQUIRED DOTACONSTANTS RESOURCES -> MAP TO CUSTOM DATASTRUCTURES -> WRITE TO ASSETS
const CDN_HOST = 'https://cdn.steamstatic.com/'
const HEROES_URL = new URL('https://raw.githubusercontent.com/odota/dotaconstants/refs/heads/master/build/heroes.json')
import type { DotaConstantsHero } from './types/DotaConstantsTypes.js'
import { formatHero } from './bindings.js'
import { tryGetImg, tryWriteImg, tryWriteJSON, assert, tryGetJson } from './flow.js';

const heroErrors: Error[] = []
const imgErrors: string[] = []
// Heroes
const heroResult = await tryGetJson<Record<string, DotaConstantsHero>>(HEROES_URL);
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