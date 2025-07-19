export interface Patient {
  /** The id of the patient. */
  id: number;
  /** The name of the patient. */
  name: string;
  /** The gender of the patient. */
  gender: string;
  /** An ISO 8601 date string. */
  date_of_birth: string;
}

export interface Note {
  /** The id of the note. */
  id: number;
  /** The name of the provider (doctor) who wrote the note. */
  provider_name?: string;
  /** the name of the hospital where the note was written. */
  hospital_name?: string;
  /** The date the note was written formatted as an ISO 8601 date string. */
  creation_date?: string;
  /** The id of the patient associated with the note. */
  patient_id: number;
  /** The text contents of the note. */
  text?: string;
}

// This interface extends the Patient interface to include notes.
export interface PatientData extends Patient {
  /** The notes associated with the patient. */
  notes?: Note[] | undefined;
}

export interface NoteFilter {
  provider_name?: string[];
  /** the name of the hospital where the note was written. */
  hospital_name?: string[];
  /** The date the note was written formatted as an ISO 8601 date string. */
  start_date?: string;
  end_date?: string;
  /** The text contents of the note. */
  text?: string;
}

// This interface is used to define the structure of the breadcrumb handle
// that can be attached to routes in the React Router.
export interface BreadcrumbHandle {
  breadcrumb: (match: any) => React.ReactNode;
}

// This interface extends the Match interface from React Router to include
// the breadcrumb handle. It allows us to access the breadcrumb function
// when rendering breadcrumbs in the application.
export interface MatchWithHandle {
  pathname: string;
  handle?: BreadcrumbHandle;
  [key: string]: any;
}
