import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch('http://backend:8000/wave_nums');
	const nums = await res.json();
	return { nums };
};
