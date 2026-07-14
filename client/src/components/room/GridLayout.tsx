import { ParticipantTile } from "./ParticipantTile";
import type { Participant } from "@/types";

interface GridLayoutProps {

  participants: Participant[];

  selfParticipant: Participant;

  pinnedId: string | null;

  onPinToggle: (id:string)=>void;

}


export function GridLayout({

  participants,

  selfParticipant,

  pinnedId,

  onPinToggle,

}:GridLayoutProps){



  const allParticipants = [

    selfParticipant,

    ...participants.filter(
      p=>p.id!==selfParticipant.id
    )

  ];



  const count = allParticipants.length;



  const getColumns = ()=>{


    if(count <= 1)
      return 1;


    if(count <= 4)
      return 2;


    if(count <= 9)
      return 3;


    if(count <= 16)
      return 4;


    if(count <= 25)
      return 5;


    return 6;

  };



  const columns = getColumns();



  return (

    <div

      className="
        w-full
        h-full
        overflow-y-auto
        overflow-x-hidden
        p-4
      "

    >


      <div

        className="
          grid
          gap-4
          w-full
          min-h-full
        "

        style={{

          gridTemplateColumns:
          `repeat(${columns}, minmax(0,1fr))`

        }}

      >


        {
          allParticipants.map((participant)=>(


            <div

              key={participant.id}

              className="
                aspect-video
                min-h-[180px]
              "

            >


              <ParticipantTile


                participant={participant}


                isSelf={
                  participant.id === selfParticipant.id
                }


                isPinned={
                  participant.id === pinnedId
                }


                onPinToggle={()=>
                  onPinToggle(participant.id)
                }


                className="
                  w-full
                  h-full
                  rounded-2xl
                "

              />


            </div>


          ))

        }


      </div>


    </div>

  );
}