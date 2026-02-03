import Header from '../components/Header';
import Footer from '../components/Footer';
import JobSearchBar from '../components/JobSearchBar';
import JobCard from '../components/JobCard';
import JobsSidebar from '../components/JobsSidebar';

const jobs = [
  {
    date: 'Feb 03, 2026',
    title: 'Certified Medical Assistant ($28/hour)',
    description: 'Hours: M-F 8:30-5 Responsibilities: The role supports healthcare teams by assisting with both clinical and non-clinical patient services under the direction of healthcare providers Key responsibilities include taking vital signs, documenting patient information, scheduling appointments, and managing patient flow This role involves direct interaction with patients to ensure their comfort and address concerns, as well as collaboration with physicians, nurse practitioners, and nursing staff to facilitate efficient care Assists junior Medical Assistants with day-to-day questions and responsibilities and helps facilitate their learning by participating in onboarding training Show patients to examination rooms, prepare necessary equipment for healthcare providers, and interview patients to obtain medical information, measure their vital signs, weight, and height, and record information in the patient\'s medical record Explain...',
    company: 'COMPLETE HEALTHCARE STAFFING',
    location: 'NEWTON, MA, USA',
  },
  {
    date: 'Feb 03, 2026',
    title: 'Bilingual Medical Assistant (Spanish/English)',
    description: 'Hiring for a bilingual Medical Assistant in Chicago, IL. MUST be fluent in Spanish and English. Pay rate: $22-25/hr based on experience Schedule: M/W/Th/F 8AM-5PM; Tuesday 8AM-8:30PM; Saturday 8AM-1PM. This will be rotating weekends. Will be scheduled for 40 hours total per week. 1 hour lunch break – 30 minutes of it is paid MUST have experienc with: vaccines, point of care testing, procedure set ups, Inventory, VFC coordination and sterilization Requirements: CMA Certification (National) within 90 days MUST have a Medical Assistant diploma or certificate from school 1 year of Medical Assistant experience Looking for skilled MA\'s Qualifications: High School Diploma or GED, completion of an accredited MA program Strong communication, organizational, and interpersonal skills Proficiency in clinical procedures, patient care, and administrative tasks Flexibility to work varied hours, including evenings and weekends, as required...',
    company: 'COMPLETE HEALTHCARE STAFFING',
    location: 'CHICAGO, IL, USA',
  },
  {
    date: 'Feb 03, 2026',
    title: 'Certified Medical Assistant ($24/hour)',
    description: 'Hiring for float medical assistants, sites available from Stamford to Rye Brook NY. Hours: 8-hour shifts between 7a-5p Type: temp to hire Responsibilities: Accompanies patients to exam/procedure room. Prepares patients for visit. Typically includes, vitals, height, weight, blood pressure, EKG, specimen collection (where applicable), phlebotomy (where applicable), INR (where applicable), pulse oximetry, spirometry, etc. Documents medical and surgical history, family history, social history, problem list, and medications, in EPIC. Assists physicians/providers with various procedures. Maintains patient records effectively Efficiently manages and routinely checks EPIC in-basket. Answers calls and return calls (in a timely manner) and provides pertinent information Requirements: High School Diploma or equivalent. Graduation from an accredited medical assistant certificate program. Certification/Registration (CCMA/CMA/AAMA/RMA) preferred.',
    company: 'COMPLETE HEALTHCARE STAFFING',
    location: 'GREENWICH, CT, USA',
  },
  {
    date: 'Feb 03, 2026',
    title: 'Certified Medical Assistant ($27/hour)',
    description: 'Specialty practice hiring for medical assistant. Hours: M-F 8-5 Type: temp to hire Major Duties and Responsibilities: Interview patients, document basic medical history and confirm purpose of visit Prepare patients for examination by performing preliminary physical tests; taking blood pressure, weight and temperature Explain treatment and procedures to patients, assist the physician during exams Collect and prepare laboratory specimens Perform basic laboratory tests and ensure test results are prepared for physicians prior to patients next appointment Instruct patients about medication and special diets, prepare and administer medications as directed by the physician Draw blood, as required, perform urodynamic studies Perform catheter changes and instruct patients on usage, pessary changes and fittings RIMSO administration Maintain exam rooms, supplies, medications, etc., clean and sterilize patient rooms and equipment Other duties as assigned...',
    company: 'COMPLETE HEALTHCARE STAFFING',
    location: 'DEDHAM, MA, USA',
  },
  {
    date: 'Feb 03, 2026',
    title: 'Maintenance Technician',
    description: 'Maintenance Technician Location: Worcester, MA Hours: Full time hours Monday – Friday 9am – 5pm On-Call Rotation – 1 week every 3 weeks Position Duties: Perform light plumbing tasks, including fixture replacements Complete apartment turnovers—cleaning, minor repairs, painting, etc. Maintain grounds and common areas, including snow removal and landscaping Communicate major maintenance issues to management Conduct routine inspections to identify potential maintenance needs and safety concerns Perform basic carpentry repairs and minor electrical repairs as required Position Requirements: Must have prior experience with light plumbing and painting Ability to perform basic maintenance tasks, including minor repairs and routine upkeep Strong attention to detail and ability to follow work orders accurately Previous background in property maintenance or a similar hands-on...',
    company: 'COMPLETE STAFFING SOLUTIONS',
    location: 'WORCESTER, MA, USA',
  },
  {
    date: 'Feb 03, 2026',
    title: 'Talent Recruiter',
    description: 'Position Summary The Recruiter is responsible for full-cycle recruitment for entry-level and hourly manufacturing roles, with a primary focus on plastic manufacturing',
    company: 'COMPLETE STAFFING SOLUTIONS',
    location: 'LEOMINSTER, MA, USA',
  },
  {
    date: 'Feb 03, 2026',
    title: 'Administrative Assistant – ASAP Start! ($23/hour)',
    description: 'Apartment complex hiring for admin to work front desk/leasing office. Temp contract for now (1 month) but ASAP start! Hours: M-F 8a-5p Duties: Answering',
    company: 'COMPLETE STAFFING SOLUTIONS',
    location: 'ORANGE, MA, USA',
  },
  {
    date: 'Feb 03, 2026',
    title: 'Payroll Associate',
    description: 'Temp to Hire Schedule: Monday through Friday 8am-4pm Responsibilities: Maintain accurate employee payroll records. Verify all payroll deductions in reference to',
    company: 'COMPLETE STAFFING SOLUTIONS',
    location: 'ORANGE, MA, USA',
  },
];

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header activePage="jobs" />
      <JobSearchBar />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Listings */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">10306 JOBS FOUND</h2>
            </div>
            
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
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <JobsSidebar />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
