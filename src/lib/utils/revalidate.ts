import { revalidatePath } from 'next/cache';

export function revalidatePost(path: string = '/admin/posts') {
  revalidatePath(path);
  revalidatePath('/');
}

export function revalidateResident(path: string = '/admin/residents') {
  revalidatePath(path);
  revalidatePath('/admin/statistics');
  revalidatePath('/');
}

export function revalidateFinance() {
  revalidatePath('/admin/finances');
  revalidatePath('/transparansi');
}

export function revalidateStaff() {
  revalidatePath('/admin/staff');
  revalidatePath('/tentang');
}

export function revalidateCategory() {
  revalidatePath('/admin/categories');
}

