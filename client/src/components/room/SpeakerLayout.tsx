import { ParticipantTile } from "./ParticipantTile";
import type { Participant } from "@/types";

interface SpeakerLayoutProps {
  participants: Participant[];
  selfParticipant: Participant;
  activeSpeakerId: string | null;
  pinnedId: string | null;
  onPinToggle: (id: string) => void;
}

export default function SpeakerLayout({
  participants,
  selfParticipant,
  activeSpeakerId,
  pinnedId,
  onPinToggle,
}: SpeakerLayoutProps) {

  /*
    Participant priority:

    1. Pinned participant
    2. Active speaker
    3. Host
    4. Self preview

  */

  const allParticipants = [
    selfParticipant,
    ...participants.filter(
      (p) => p.id !== selfParticipant.id
    ),
  ];


  const displayedParticipant =
    allParticipants.find(
      (p) => p.id === pinnedId
    )
    ??
    allParticipants.find(
      (p) => p.id === activeSpeakerId
    )
    ??
    allParticipants.find(
      (p) => p.isSpeaking
    )
    ??
    allParticipants.find(
      (p) => p.isHost
    )
    ??
    selfParticipant;



  const thumbnails = allParticipants.filter(
    (p) => p.id !== displayedParticipant.id
  );


  return (

    <div className="
      flex
      flex-col
      h-full
      w-full
      overflow-hidden
      bg-slate-950
    ">


      {/* ================= MAIN STAGE ================= */}

      <div className="
        flex-1
        min-h-0
        flex
        items-center
        justify-center
        p-4
      ">


        <ParticipantTile

          participant={displayedParticipant}

          isSelf={
            displayedParticipant.id === selfParticipant.id
          }

          isPinned={
            displayedParticipant.id === pinnedId
          }

          onPinToggle={() =>
            onPinToggle(displayedParticipant.id)
          }


          /*
             Important

             No fixed height
             Parent controls size

          */

          className="
            w-full
            h-full
            max-w-7xl
            rounded-2xl
          "

        />

      </div>



      {/* ================= BOTTOM FILMSTRIP ================= */}


      {
        thumbnails.length > 0 && (

          <div className="
            shrink-0
            h-28
            px-4
            pb-3
          ">


            <div className="
              h-full
              flex
              items-center
              justify-center
              gap-3
              overflow-x-auto
              scrollbar-thin
            ">


              {
                thumbnails.map((participant) => (

                  <ParticipantTile

                    key={participant.id}

                    participant={participant}

                    isSelf={
                      participant.id === selfParticipant.id
                    }

                    isPinned={
                      participant.id === pinnedId
                    }

                    onPinToggle={() =>
                      onPinToggle(participant.id)
                    }


                    className="
                      h-full
                      w-44
                      shrink-0
                      rounded-xl
                      cursor-pointer
                      transition-transform
                      hover:scale-105
                    "

                  />

                ))
              }


            </div>


          </div>

        )
      }


    </div>

  );
}