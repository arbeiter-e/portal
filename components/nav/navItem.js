import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

export default function NavItem({ text, icon, link }) {
    const router = useRouter();
    const currentLink = router.pathname || "/"; // Use "/" if pathname is empty

    const isCurrentLink = currentLink === link;
    const defaultClasses = "flex gap-6 items-center text-zinc-300 hover:gap-8 hover:text-white transition-all duration-100 cursor-pointer select-none";
    const classes = isCurrentLink ? "flex gap-8 text-white items-center transition-all duration-100 select-none cursor-default" : defaultClasses;

    const redirect = () => {
        if (link) {
            router.push(link);
        } else {
            alert('Coming soon.');
        }
    };

    return (
        <li className={classes} onClick={redirect}>
            <span className="font-semibold">{text}</span>
        </li>
    );
}
