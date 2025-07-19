import { useLoaderData } from "react-router";
import ViewContainer from "./containers/ViewContainer";
import { PatientData } from "./types";

/**
 * PatientView component displays detailed information about a specific patient.
 */
export default function PatientView() {
  let patientData = useLoaderData() as PatientData;

  return (
    <ViewContainer title="Patient Data">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">{patientData.name}</h2>
        <div className="mb-2">
          <b>Gender:</b> {patientData.gender}
        </div>
        <div className="mb-2">
          <b>Date of Birth:</b>{" "}
          {new Date(patientData.date_of_birth).toLocaleDateString()}
        </div>
        {/* notes */}
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Notes</h3>
          {patientData.notes && patientData.notes.length > 0 ? (
            patientData.notes.map((note) => (
              <div key={note.id} className="border p-2 mb-2 rounded">
                <div>
                  <b>Note ID:</b> {note.id}
                </div>
                <div>
                  <b>Text:</b> {note.text}
                </div>
                {note.creation_date && (
                  <div>
                    <b>Created At:</b>{" "}
                    {new Date(note.creation_date).toLocaleString()}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No notes available for this patient.</p>
          )}
        </div>
      </div>
    </ViewContainer>
  );
}
