import { createBrowserRouter } from "react-router";
import patientNotesData from "../data/mock_notes.json";
import patientData from "../data/mock_patients.json";
import App from "./App";
import PatientTable from "./PatientTable";
import PatientView from "./PatientView";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    handle: {
      breadcrumb: () => "Patient Lookup",
    },
    children: [
      { index: true, Component: PatientTable },
      {
        path: "/patient/:patientId",
        handle: {
          breadcrumb: (match: any) => {
            const patient = patientData.find(
              (p) => p.id === parseInt(match.params.patientId as string)
            );
            return patient ? patient.name : "Patient";
          },
        },
        loader: ({ params }) => {
          if (!params?.patientId) {
            throw new Response("Not Found", { status: 404 });
          }
          let patient = patientData.find(
            (p) => p.id === parseInt(params.patientId as string)
          );
          if (!patient) {
            throw new Response("Not Found", { status: 404 });
          }

          const notes = patientNotesData.filter(
            (note) => note.patient_id === patient.id
          );

          return { ...patient, notes };
        },
        Component: PatientView,
      },
    ],
  },
]);
