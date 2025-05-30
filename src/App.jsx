import React from "react";
import "./App.css";
import { Linkedin } from "lucide-react";

function App() {
  return (
    <main className="p-6 max-w-5xl mx-auto space-y-10">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Janmejoy Kar</h1>
        <p className="text-lg text-gray-600">
          Data Scientist | Expert in Cloud Computing, Data Engineering, and Deep Learning
        </p>
        <div className="flex justify-center space-x-4">
          <a href="mailto:janmejoy1807@gmail.com" className="text-blue-600 hover:underline">janmejoy1807@gmail.com</a>
          <a href="https://www.linkedin.com/in/janmejoy-kar-849756196" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
            <Linkedin className="inline mr-1" /> LinkedIn
          </a>
        </div>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Summary</h2>
        <div className="p-4 bg-white shadow-md rounded text-gray-700">
          Dedicated Data Scientist with expertise in cloud platforms like Azure and AWS, strong knowledge in Python, R, SQL, and deep learning frameworks. Proven track record in ETL, data analytics, and impactful business solutions. Holds a Master's in Business Analytics and certified in Microsoft Fabric and AWS Cloud. Currently at Group O, enhancing operational efficiency through data-driven decision making.
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Experience</h2>
        <div className="space-y-4">
          {[
            {
              title: "Data Scientist",
              company: "Group O",
              duration: "Jan 2024 – Present",
              location: "Roanoke, Texas"
            },
            {
              title: "Graduate Teaching Assistant",
              company: "University of North Texas",
              duration: "Aug 2023 – Dec 2023",
              location: "Denton, Texas"
            },
            {
              title: "Business Strategist",
              company: "FilingRabbit",
              duration: "Nov 2020 – Jan 2021",
              location: "Kolkata, India"
            }
          ].map((exp, idx) => (
            <div key={idx} className="p-4 bg-white shadow rounded">
              <h3 className="text-xl font-semibold">{exp.title}</h3>
              <p className="text-gray-600">{exp.company} — {exp.duration}</p>
              <p className="text-sm text-gray-500">{exp.location}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Education</h2>
        <ul className="space-y-3">
          <li>
            <strong>University of North Texas</strong> – Master's in Business Analytics (2022–2023)
          </li>
          <li>
            <strong>Sandip University</strong> – Bachelor's in Computer Science (2017–2021)
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Certifications & Awards</h2>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Microsoft Certified: Fabric Analytics Engineer Associate</li>
          <li>AWS Cloud Practitioner</li>
          <li>Winner – IBM ICE Day Hackathon 2020</li>
          <li>Runner-up – IBM ICE Day Hackathon 2019</li>
        </ul>
      </section>
    </main>
  );
}

export default App;
