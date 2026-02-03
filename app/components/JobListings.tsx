import JobCard from './JobCard';

interface Job {
  date: string;
  title: string;
  description: string;
  company: string;
  location: string;
}

const jobs: Job[] = [
  {
    date: 'Feb 03, 2026',
    title: 'Certified Medical Assistant ($28/hour)',
    description: 'Hours: M-F 8:30-5 Responsibilities: The role supports healthcare teams by assisting with both clinical and non-clinical patient services under the direction of healthcare providers Key responsibilities include taking vital signs, documenting patient information, scheduling appointments, and managing patient flow This role involves direct interaction with patients to ensure their comfort and address concerns, as well as collaboration with physicians, nurse practitioners, and nursing staff to facilitate efficient care Assists junior Medical Assistants with day-to-day questions and responsibilities and helps facilitate their learning by participating in onboarding training Show patients to examination rooms, prepare necessary equipment for healthcare providers, and interview patients to obtain medical information, measure their vital signs, weight, and height, and record information in the patient\'s medical record Explain...',
    company: 'Complete Healthcare Staffing',
    location: 'Newton, MA, USA',
  },
  {
    date: 'Feb 03, 2026',
    title: 'Bilingual Medical Assistant (Spanish/English)',
    description: 'Hiring for a bilingual Medical Assistant in Chicago, IL. MUST be fluent in Spanish and English. Pay rate: $22-25/hr based on experience Schedule: M/W/Th/F 8AM-5PM; Tuesday 8AM-8:30PM; Saturday 8AM-1PM. This will be rotating weekends. Will be scheduled for 40 hours total per week. 1 hour lunch break – 30 minutes of it is paid MUST have experienc with: vaccines, point of care testing, procedure set ups, Inventory, VFC coordination and sterilization Requirements: CMA Certification (National) within 90 days MUST have a Medical Assistant diploma or certificate from school 1 year of Medical Assistant experience Looking for skilled MA\'s Qualifications: High School Diploma or GED, completion of an accredited MA program Strong communication, organizational, and interpersonal skills Proficiency in clinical procedures, patient care, and administrative tasks Flexibility to work varied hours, including evenings and weekends, as required...',
    company: 'Complete Healthcare Staffing',
    location: 'Chicago, IL, USA',
  },
  {
    date: 'Feb 03, 2026',
    title: 'Part-time (16 hours/week) Registered Nurse $55/hr',
    description: 'Hiring for a part-time (16 hours/week) Registered Nurse to do Community Health/Home Health nursing. Pay: $55/hr Schedule: M-F 8AM-4PM (2 – 8 hour shifts) Community based service program – for adults to receive services in their own communities (shelters and personal homes) rather than isolated settings. Driving required to care for participants in programs – traveling in Dorchester, Hyde Park, Rosindale, Mattapan, Cambridge, Brookline, Allston, and Roxbury area. RNs would report to office in the morning in Dorchester and from there leave to conduct visits. – Mileage is reimbursed – reimbursement does not include commute from home to office in the morning and does not include commute from office to home or commute from last patient to home at the end of the day. – Training happens on the job – cross training from other nurses. Experience/Skills: Minimum 1-2 years of home health/community health background – open to candidates who have worked in home health/...',
    company: 'Complete Healthcare Staffing',
    location: 'Boston, MA, USA',
  },
  {
    date: 'Feb 03, 2026',
    title: 'Certified Medical Assistant ($24/hour)',
    description: 'Hiring for float medical assistants, sites available from Stamford to Rye Brook NY. Hours: 8-hour shifts between 7a-5p Type: temp to hire Responsibilities: Accompanies patients to exam/procedure room. Prepares patients for visit. Typically includes, vitals, height, weight, blood pressure, EKG, specimen collection (where applicable), phlebotomy (where applicable), INR (where applicable), pulse oximetry, spirometry, etc. Documents medical and surgical history, family history, social history, problem list, and medications, in EPIC. Assists physicians/providers with various procedures. Maintains patient records effectively Efficiently manages and routinely checks EPIC in-basket. Answers calls and return calls (in a timely manner) and provides pertinent information Requirements: High School Diploma or equivalent. Graduation from an accredited medical assistant certificate program. Certification/Registration (CCMA/CMA/AAMA/RMA) preferred.',
    company: 'Complete Healthcare Staffing',
    location: 'Greenwich, CT, USA',
  },
  {
    date: 'Feb 03, 2026',
    title: 'Certified Medical Assistant ($27/hour)',
    description: 'Specialty practice hiring for medical assistant. Hours: M-F 8-5 Type: temp to hire Major Duties and Responsibilities: Interview patients, document basic medical history and confirm purpose of visit Prepare patients for examination by performing preliminary physical tests; taking blood pressure, weight and temperature Explain treatment and procedures to patients, assist the physician during exams Collect and prepare laboratory specimens Perform basic laboratory tests and ensure test results are prepared for physicians prior to patients next appointment Instruct patients about medication and special diets, prepare and administer medications as directed by the physician Draw blood, as required, perform urodynamic studies Perform catheter changes and instruct patients on usage, pessary changes and fittings RIMSO administration Maintain exam rooms, supplies, medications, etc., clean and sterilize patient rooms and equipment Other duties as assigned...',
    company: 'Complete Healthcare Staffing',
    location: 'Dedham, MA, USA',
  },
];

export default function JobListings() {
  return (
    <section>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Latest Jobs</h3>
      <div className="space-y-6">
        {jobs.map((job, index) => (
          <JobCard
            key={index}
            date={job.date}
            title={job.title}
            description={job.description}
            company={job.company}
            location={job.location}
          />
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <a href="#" className="text-yellow-500 hover:text-yellow-600 font-semibold">
          View all jobs →
        </a>
      </div>
    </section>
  );
}
