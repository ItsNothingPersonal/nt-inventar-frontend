import type { Gegenstand } from '$lib/types/gegenstand';
import type { Kiste } from '$lib/types/kiste';
import type { Lagerort } from '$lib/types/lagerort';
import type PocketBase from 'pocketbase';

const getGegenstaende = async (pb: PocketBase) => {
	let data: Gegenstand[] = [];

	try {
		data = await pb.collection('gegenstaende').getFullList<Gegenstand>(200, {
			sort: '-created',
			expand: 'kiste'
		});
	} catch (error) {
		console.error(error);
	}

	return data;
};

const getKisten = async (pb: PocketBase) => {
	let data: Kiste[] = [];

	try {
		data = await pb.collection('kisten').getFullList<Kiste>(200, {
			sort: '-created',
			expand: 'projekt, lagerort'
		});
	} catch (error) {
		console.error(error);
	}

	return data;
};

const getLagerorte = async (pb: PocketBase) => {
	let data: Lagerort[] = [];

	try {
		data = await pb.collection('lagerorte').getFullList<Lagerort>(200 /* batch size */, {
			sort: '-created'
		});
	} catch (error) {
		console.error(error);
	}

	return data;
};

export { getGegenstaende, getKisten, getLagerorte };
