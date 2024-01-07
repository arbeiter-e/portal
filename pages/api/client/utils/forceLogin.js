import Router, { useRouter } from "next/router";

export function forceLogin() {
    sessionStorage.removeItem('sessionId');
    sessionStorage.removeItem('userId');
    Router.push('/login');
}