import type { Participant } from "@/types";
import { ParticipantTile } from "./ParticipantTile";


interface Props {

    participants: Participant[];

    selfParticipant: Participant;

}



export function ParticipantsStrip({

    participants,

    selfParticipant

}: Props) {


    const list = [
        selfParticipant,
        ...participants
    ];



    return (

        <div
            className="
                    h-full
                    flex
                    items-center
                    justify-center
                    gap-3
                    px-4
                    overflow-x-auto
                    "
        >


            {
                list.map((participant) => (

                    <div

                        key={participant.id}

                        className="
                                    h-24
                                    w-40
                                    shrink-0
                                    "

                    >

                        <ParticipantTile

                            participant={participant}

                            isSelf={
                                participant.id === selfParticipant.id
                            }

                            isPinned={false}

                            onPinToggle={() => { }}

                            className="
                                    h-full
                                    w-full
                                    rounded-xl
                                    "

                        />

                    </div>


                ))
            }


        </div>

    )

}