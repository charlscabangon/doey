import { usersData } from './users';
import type { User } from '@/types';

export function getUsers(): User[] {
    return cloneData(usersData);
}

export function getUserById(id: string): User | null {
    const user = usersData.find(u => u.id === id);
    return user ? cloneData(user) : null;
}

export function createUser(data: Omit<User, 'id'>): User {
    const user: User = {
        ...data,
        id: generateId('user')
    };
    usersData.push(user);
    return cloneData(user);
}

export function updateUser(id: string, data: Partial<User>): User | null {
    const index = usersData.findIndex(u => u.id === id);
    if (index === -1) return null;

    usersData[index] = {
        ...usersData[index],
        ...data,
        id: usersData[index].id
    };
    return cloneData(usersData[index]);
}

export function deleteUser(id: string): boolean {
    const index = usersData.findIndex(u => u.id === id);
    if (index === -1) return false;

    usersData.splice(index, 1);
    return true;
}
