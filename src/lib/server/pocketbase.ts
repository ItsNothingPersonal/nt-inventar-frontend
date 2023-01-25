import type { Gegenstand } from '$lib/types/gegenstand';
import type { Kiste } from '$lib/types/kiste';
import type { Lagerort } from '$lib/types/lagerort';
import type PocketBase from 'pocketbase';

const getGegenstaende = async (pb: PocketBase) => {
	let data: Gegenstand[] = [];

	try {
		data = await pb.collection('gegenstaende').getFullList<Gegenstand>(200, {
			sort: 'name',
			expand: 'kiste'
		});
	} catch (error) {
		console.error(error);
	}

	return data;
};

const getGegenstaendeForKiste = async (pb: PocketBase, id: string) => {
	let data: Gegenstand[] = [];

	try {
		data = await pb.collection('gegenstaende').getFullList<Gegenstand>(200, {
			sort: 'name',
			filter: `kiste.id = "${id}"`,
			expand: 'kiste, kiste.lagerort'
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
			sort: 'lagerort.name, name',
			expand: 'lagerort'
		});
	} catch (error) {
		console.error(error);
	}

	return data;
};

const getKisteById = async (pb: PocketBase, id: string) => {
	let data: Kiste | undefined = undefined;

	try {
		data = await pb.collection('kisten').getFirstListItem<Kiste>(`id="${id}"`, {
			sort: 'name',
			expand: 'lagerort'
		});
	} catch (error) {
		console.error(error);
	}

	return data;
};

const getKistenByLagerortId = async (pb: PocketBase, id: string) => {
	let data: Kiste[] = [];

	try {
		data = await pb.collection('kisten').getFullList<Kiste>(200, {
			filter: `lagerort.id="${id}"`,
			sort: 'name'
		});
	} catch (error) {
		console.error(error);
	}

	return data;
};

const getLagerorte = async (pb: PocketBase) => {
	let data: Lagerort[] = [];

	try {
		data = await pb.collection('lagerorte').getFullList<Lagerort>(200, {
			sort: 'name'
		});
	} catch (error) {
		console.error(error);
	}

	return data;
};

const getLagerortById = async (pb: PocketBase, id: string) => {
	let data: Lagerort | undefined = undefined;

	try {
		data = await pb.collection('lagerorte').getFirstListItem<Lagerort>(`id="${id}"`, {
			sort: 'name'
		});
	} catch (error) {
		console.error(error);
	}

	return data;
};

export {
	getGegenstaende,
	getGegenstaendeForKiste,
	getKisten,
	getKisteById,
	getLagerorte,
	getLagerortById,
	getKistenByLagerortId
};
