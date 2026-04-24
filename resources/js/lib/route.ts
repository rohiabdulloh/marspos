import { route } from 'ziggy-js';
import { Ziggy } from '@/ziggy';

export default function r(name: string, params?: any) {
    return route(name, params, undefined, Ziggy as any);
}