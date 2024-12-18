const data = [
  {
      courseCode: "ML101",
      name: "Machine Learning",
      shortName: "ML",
      credits: 3,
      type: "THEORY",
      department: "CSE",
      semester: "3-2",
      regulation: "NRIA 20",
      category: { isLab: false },
  },
  {
      courseCode: "CD101",
      name: "Compiler Design",
      shortName: "CD",
      credits: 3,
      type: "THEORY",
      department: "CSE",
      semester: "3-2",
      regulation: "NRIA 20",
      category: { isLab: false },
  },
  {
      courseCode: "CNS101",
      name: "Cryptography and Network Security",
      shortName: "CNS",
      credits: 3,
      type: "THEORY",
      department: "CSE",
      semester: "3-2",
      regulation: "NRIA 20",
      category: { isLab: false },
  },
  {
      courseCode: "OE201",
      name: "OE2: Image Processing",
      shortName: "IP",
      credits: 3,
      type: "THEORY",
      department: "CSE",
      semester: "3-2",
      regulation: "NRIA 20",
      category: { isLab: false },
  },
  {
      courseCode: "PE201",
      name: "PE2: Big Data Analytics",
      shortName: "BDA",
      credits: 3,
      type: "THEORY",
      department: "CSE",
      semester: "3-2",
      regulation: "NRIA 20",
      category: { isLab: false },
  },
  {
      courseCode: "ML102",
      name: "Machine Learning Lab",
      shortName: "ML Lab",
      credits: 2,
      type: "LAB",
      department: "CSE",
      semester: "3-2",
      regulation: "NRIA 20",
      category: { isLab: true },
  },
  {
      courseCode: "CD102",
      name: "Compiler Design Lab",
      shortName: "CD Lab",
      credits: 2,
      type: "LAB",
      department: "CSE",
      semester: "3-2",
      regulation: "NRIA 20",
      category: { isLab: true },
  },
  {
      courseCode: "RP101",
      name: "R Programming Lab",
      shortName: "RPL",
      credits: 2,
      type: "LAB",
      department: "CSE",
      semester: "3-2",
      regulation: "NRIA 20",
      category: { isLab: true },
  },
  {
      courseCode: "MSTL101",
      name: "Mean Stack Technology Lab",
      shortName: "MST Lab",
      credits: 2,
      type: "LAB",
      department: "CSE",
      semester: "3-2",
      regulation: "NRIA 20",
      category: { isLab: true },
  },
  {
      courseCode: "ES201",
      name: "Employability Skills-2",
      shortName: "ES2",
      credits: 3,
      type: "THEORY",
      department: "CSE",
      semester: "3-2",
      regulation: "NRIA 20",
      category: { isLab: false },
  },
  {
      courseCode: "CPT101",
      name: "CPT",
      shortName: "CPT",
      credits: 2,
      type: "LAB",
      department: "CSE",
      semester: "3-2",
      regulation: "NRIA 20",
      category: { isLab: true },
  },
  // Additional courses for 3-1 semester
  {
      courseCode: "20A3105401",
      name: "Artificial Intelligence",
      shortName: "AI",
      credits: 3,
      type: "THEORY",
      department: "CSE",
      semester: "3-1",
      regulation: "NRIA 20",
      category: { isLab: false },
  },
  {
      courseCode: "20A3105402",
      name: "Computer Networks",
      shortName: "CN",
      credits: 3,
      type: "THEORY",
      department: "CSE",
      semester: "3-1",
      regulation: "NRIA 20",
      category: { isLab: false },
  },
  {
      courseCode: "20A3105403",
      name: "Design and Analysis of Algorithms",
      shortName: "DAA",
      credits: 3,
      type: "THEORY",
      department: "CSE",
      semester: "3-1",
      regulation: "NRIA 20",
      category: { isLab: false },
  },
  {
      courseCode: "28A3104601",
      name: "Microprocessor and Applications",
      shortName: "MPA",
      credits: 3,
      type: "THEORY",
      department: "CSE",
      semester: "3-1",
      regulation: "NRIA 20",
      category: { isLab: false },
  },
  {
      courseCode: "20A1105491",
      name: "Computer Networks Lab",
      shortName: "CN Lab",
      credits: 2,
      type: "LAB",
      department: "CSE",
      semester: "3-1",
      regulation: "NRIA 20",
      category: { isLab: true },
  },
  {
      courseCode: "20A3105492",
      name: "AI Programming Lab",
      shortName: "AI Lab",
      credits: 2,
      type: "LAB",
      department: "CSE",
      semester: "3-1",
      regulation: "NRIA 20",
      category: { isLab: true },
  },
  {
      courseCode: "20A3105991",
      name: "DevOps Lab",
      shortName: "DevOps Lab",
      credits: 2,
      type: "LAB",
      department: "CSE",
      semester: "3-1",
      regulation: "NRIA 20",
      category: { isLab: true },
  },
  {
    courseCode: "PS201",
    name: "Probability & Statistics",
    shortName: "P&S",
    credits: 3,
    type: "THEORY",
    department: "CSE",
    semester: "2-2",
    regulation: "NRIA 23",
    category: { isLab: false },
},
{
    courseCode: "AI201",
    name: "Artificial Intelligence",
    shortName: "AI",
    credits: 3,
    type: "THEORY",
    department: "CSE",
    semester: "2-2",
    regulation: "NRIA 23",
    category: { isLab: false },
},
{
    courseCode: "OS201",
    name: "Operating Systems",
    shortName: "OS",
    credits: 3,
    type: "THEORY",
    department: "CSE",
    semester: "2-2",
    regulation: "NRIA 23",
    category: { isLab: false },
},
{
    courseCode: "ADS201",
    name: "Advanced Data Structures",
    shortName: "ADS",
    credits: 3,
    type: "THEORY",
    department: "CSE",
    semester: "2-2",
    regulation: "NRIA 23",
    category: { isLab: false },
},
{
    courseCode: "DT201",
    name: "Design Thinking",
    shortName: "DT",
    credits: 3,
    type: "THEORY",
    department: "CSE",
    semester: "2-2",
    regulation: "NRIA 23",
    category: { isLab: false },
},
{
    courseCode: "OT201",
    name: "Optimization Techniques",
    shortName: "OT",
    credits: 3,
    type: "THEORY",
    department: "CSE",
    semester: "2-2",
    regulation: "NRIA 23",
    category: { isLab: false },
},
{
    courseCode: "OSL201",
    name: "Operating Systems Lab",
    shortName: "OS Lab",
    credits: 2,
    type: "LAB",
    department: "CSE",
    semester: "2-2",
    regulation: "NRIA 23",
    category: { isLab: true },
},
{
    courseCode: "ADSL201",
    name: "Advanced Data Structures Lab",
    shortName: "ADS Lab",
    credits: 2,
    type: "LAB",
    department: "CSE",
    semester: "2-2",
    regulation: "NRIA 23",
    category: { isLab: true },
},
{
    courseCode: "DTL201",
    name: "Design Thinking Lab",
    shortName: "DT Lab",
    credits: 2,
    type: "LAB",
    department: "CSE",
    semester: "2-2",
    regulation: "NRIA 23",
    category: { isLab: true },
},
{
    courseCode: "FSWDL201",
    name: "Full Stack Web Development Lab",
    shortName: "FSWD Lab",
    credits: 2,
    type: "LAB",
    department: "CSE",
    semester: "2-2",
    regulation: "NRIA 23",
    category: { isLab: true },
},

];

module.exports = { data };