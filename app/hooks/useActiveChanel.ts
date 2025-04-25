import { useEffect, useState } from "react";
import useActiveList from "./useActiveList";
import { Channel, Members } from "pusher-js";
import { pusherClient } from "../libs/pusher";


const useActiveChanel = () => {
    const { set, add, remove } = useActiveList();
    const [activeChanel, setActiveChanel] = useState<Channel | null>(null)

    useEffect(() => {
        let chanel = activeChanel
        if(!chanel) {
            chanel = pusherClient.subscribe("presence-messenger")
            setActiveChanel(chanel)
        }
        chanel.bind("pusher:subscription_succeeded", (members:Members) => {
            const intitalMembers:string[] = []

            members.each((member:Record<string,any>) => intitalMembers.push(member.id))
            set(intitalMembers)
        })

        chanel.bind("pusher:member_added", (member:Record<string,any>) => {
            add(member.id)
        })

        chanel.bind("pusher:member_removed", (member:Record<string,any>) => {
            remove(member.id)
        })

        return () => {
            if(activeChanel) {
                pusherClient.unsubscribe("presence-messenger")
                setActiveChanel(null)
            }
        }

    },[activeChanel, set, add, remove])

}

export default useActiveChanel;


