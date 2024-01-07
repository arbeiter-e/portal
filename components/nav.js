import { faBank, faCity, faCog, faCogs, faGlobe, faGlobeEurope, faHeartBroken, faHouse, faNewspaper, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import playerStore from '@/components/states/gettingPlayersInformation';
import NavItem from "./nav/navItem";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Sidebar() {
  const router = useRouter();
  const currentLink = router.currentPath;
  const isCurrentLink = currentLink === "/settings";
  const { data, fetchData } = playerStore();

  const forceToSettings = () => {
    router.push('/settings');
  };

  if (!data) {
    return null; // or a loading state
  }

  const menuItems = [
    { text: 'Home', link: '/' },
    { text: 'News' },
    { text: 'All Nations' },
    { text: 'Members', link: '/nation/members' },
    { text: 'Relations'},
    { text: 'Economics', link: '/nation/economics' },
    { text: data?.town?.name, link: '/town' },
  ];
  return (
    <>
      <div className="relative top-0 h-[10rem] bg-zinc-900 flex items-center w-[100vw] justify-between px-12 shadow-xl">
        {/* Top section */}
          <div className="flex items-center">
            <Image src='/assets/logos/long.png' alt="Arbeiter logo" className="select-none" width="250" height="1000" />
          </div>
          <div className="flex gap-8 items-center">
            <span className="font-bold hidden md:block">Hey there, {data.user.username}</span>
            <div onClick={forceToSettings} className="rounded-full overflow-hidden bg-gradient-to-br from-cyan-400 to-cyan-600 p-1">
              <Avatar>
                <AvatarImage src={`https://minotar.net/helm/${data.user.mcUUID}/55.png`} />
                <AvatarFallback>{(data.user.username).charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        {/* Manage Town */}

        {/* Bust */}
      </div>
      <div className="bg-zinc-800 h-[4rem] overflow-x-scroll flex mb-8">
        {renderMenu(menuItems)}
      </div>
    </>
  );
}

function renderMenu(items) {
  return (
    <div className="flex w-full mx-8">
      <ul className="flex items-center justify-evenly w-full whitespace-nowrap gap-8 mx-8">
        {items.map((item, index) => (
          <NavItem key={index} icon={item.icon} text={item.text} link={item.link} />
        ))}
      </ul>
    </div>
  );
}