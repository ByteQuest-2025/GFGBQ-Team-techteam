import React from 'react';
import { BookOpen, Play } from 'lucide-react';

const Learn = ({ riskHistory }) => {
  // Get latest risk for personalization
  const latestRisk = riskHistory.length > 0 ? riskHistory[0] : null;

  const articles = [
    {
      id: 1,
      title: "Understanding Silent Diseases",
      content: "Silent diseases are conditions that develop without obvious symptoms. Diabetes and hypertension are prime examples. They can cause significant damage before diagnosis. Regular screening and lifestyle changes are key to prevention.",
      link: "https://www.cdc.gov/chronicdisease/about/index.htm"
    },
    {
      id: 2,
      title: "Early Signs of Diabetes",
      content: "While diabetes is often asymptomatic, early signs include increased thirst, frequent urination, unexplained weight loss, increased hunger, fatigue, slow-healing sores, frequent infections, blurred vision, and tingling or numbness in hands or feet. If you experience these, consult a doctor.",
      link: "https://www.cdc.gov/diabetes/basics/symptoms.html"
    },
    {
      id: 3,
      title: "Hypertension: The Silent Killer",
      content: "High blood pressure rarely shows symptoms but can lead to heart disease, stroke, and kidney damage. Risk factors include family history, obesity, lack of exercise, smoking, and high salt intake. Regular monitoring and lifestyle changes can control it.",
      link: "https://www.cdc.gov/bloodpressure/about.htm"
    }
  ];

  const videos = [
    {
      id: 1,
      title: "Diabetes Prevention Tips",
      embedId: "zJnZXInr83k"  // Placeholder, replace with real health video ID
    },
    {
      id: 2,
      title: "Managing Blood Pressure",
      embedId: "iZHVfk8wcEA"  // Placeholder, replace with real health video ID
    }
  ];

  const personalizedTips = () => {
    if (!latestRisk) return ["Complete a risk assessment to get personalized tips!"];

    const tips = [];
    if (latestRisk.disease === 'diabetes') {
      if (latestRisk.risk_level === 'High') {
        tips.push("Focus on weight management and regular blood sugar monitoring.");
        tips.push("Consult an endocrinologist for personalized screening.");
      } else {
        tips.push("Maintain a balanced diet low in refined sugars.");
        tips.push("Aim for 150 minutes of moderate exercise per week.");
      }
    } else if (latestRisk.disease === 'hypertension') {
      if (latestRisk.risk_level === 'High') {
        tips.push("Monitor blood pressure daily and reduce sodium intake.");
        tips.push("Consider medication consultation with your doctor.");
      } else {
        tips.push("Incorporate potassium-rich foods like bananas and spinach.");
        tips.push("Practice stress-reduction techniques like meditation.");
      }
    }
    return tips;
  };

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-white/10">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <BookOpen className="mr-2 text-blue-400" size={20} />
        Learn About Silent Diseases
      </h2>

      {/* Personalized Tips */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 text-blue-400">Personalized Tips</h3>
        <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700">
          <ul className="list-disc pl-5 space-y-2 text-gray-200">
            {personalizedTips().map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Articles */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <BookOpen className="mr-2 text-green-400" size={18} />
          Articles
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {articles.map(article => (
            <div key={article.id} className="bg-green-900/20 rounded-lg p-4 border border-green-700">
              <h4 className="font-medium text-green-400 mb-2">{article.title}</h4>
              <p className="text-sm text-gray-300 mb-2">{article.content}</p>
              <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">
                Learn More
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Videos */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Play className="mr-2 text-red-400" size={18} />
          Videos
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {videos.map(video => (
            <div key={video.id} className="bg-red-900/20 rounded-lg p-4 border border-red-700">
              <h4 className="font-medium text-red-400 mb-2">{video.title}</h4>
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${video.embedId}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded"
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Learn;