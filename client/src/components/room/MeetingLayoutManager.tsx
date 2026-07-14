import { GridLayout } from "./GridLayout";
import SpeakerLayout from "./SpeakerLayout";
import { PresentationLayout } from "./PresentationLayout";

import type { Participant } from "@/types";

interface Props {
    layoutMode: "speaker" | "grid" | "presentation";

    participants: Participant[];

    selfParticipant: Participant;

    activeSpeakerId: string | null;

    pinnedParticipantId: string | null;

    onPinToggle: (participantId: string) => void;
}

export default function MeetingLayoutManager({
    layoutMode,
    participants,
    selfParticipant,
    activeSpeakerId,
    pinnedParticipantId,
    onPinToggle,
}: Props) {

    switch (layoutMode) {

        case "speaker":
            return (
                <SpeakerLayout
                    participants={participants}
                    selfParticipant={selfParticipant}
                    activeSpeakerId={activeSpeakerId}
                    pinnedId={pinnedParticipantId}
                    onPinToggle={onPinToggle}
                />
            );

        case "presentation":
            return (
                <PresentationLayout
                    participants={participants}
                    selfParticipant={selfParticipant}
                    activeSpeakerId={activeSpeakerId}
                    pinnedId={pinnedParticipantId}
                    onPinToggle={onPinToggle}
                />
            );

        case "grid":
        default:
            return (
                <GridLayout
                    participants={participants}
                    selfParticipant={selfParticipant}
                    pinnedId={pinnedParticipantId}
                    onPinToggle={onPinToggle}
                />
            );
    }
}