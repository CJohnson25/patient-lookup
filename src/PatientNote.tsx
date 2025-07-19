import { Note } from "./types";
import { formatDateTime } from "./utils";

/**
 * PatientNote component displays a single note for a patient.
 * It includes the note's creation date, provider name, hospital name, and the note text.
 */
export default function PatientNote(props: { note: Note }) {
  return (
    <div className="p-2">
      {props.note.creation_date && (
        <div>{formatDateTime(props.note.creation_date)}</div>
      )}
      <div>
        <b>Provider: </b>
        {props.note.provider_name}
      </div>
      <div>
        <b>Hospital:</b> {props.note.hospital_name}
      </div>
      <p>{props.note.text}</p>
    </div>
  );
}
