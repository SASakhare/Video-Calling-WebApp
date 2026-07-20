import { GridLayout } from "./GridLayout";
import PresentationLayout from "./PresentationLayout";
import SpeakerLayout from "./SpeakerLayout";

import type { MeetingParticipant, Participant } from "@/types";

interface Props {
    layoutMode: "speaker" | "grid" | "presentation";

    participants: MeetingParticipant[];

    activeSpeakerId: string | null;

    pinnedParticipantId: string | null;

    participantsOpen: boolean;

    chatOpen: boolean;

    onPinToggle: (id: string) => void;
}

export default function MeetingLayoutManager({
    layoutMode,
    participants,
    activeSpeakerId,
    pinnedParticipantId,
    participantsOpen,
    chatOpen,
    onPinToggle,
}: Props) {
    switch (layoutMode) {
        case "speaker":
            return (
                <SpeakerLayout
                    participants={participants}
                    activeSpeakerId={activeSpeakerId}
                    pinnedId={pinnedParticipantId}
                    participantsOpen={participantsOpen}
                    chatOpen={chatOpen}
                    onPinToggle={onPinToggle}
                />
            );

        case "presentation":
            return (
                <PresentationLayout
                    participants={participants}
                    activeSpeakerId={activeSpeakerId}
                    pinnedId={pinnedParticipantId}
                    participantsOpen={participantsOpen}
                    chatOpen={chatOpen}
                    onPinToggle={onPinToggle}
                />
            );

        case "grid":
        default:
            return (
                <GridLayout
                    participants={participants}
                    pinnedId={pinnedParticipantId}
                    onPinToggle={onPinToggle}
                />
            );
    }
}