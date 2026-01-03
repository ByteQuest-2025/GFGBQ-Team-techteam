import { useState } from 'react';

export default function RiskForm({ onPredict, loading }) {
  const [disease, setDisease] = useState('diabetes');
  const [inputs, setInputs] = useState({
    age: '1',
    bmi: '',
    physActivity: true,
    genHlth: '3',
    highBP: false,
    highChol: false,
    smoker: false
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const bmi = parseFloat(inputs.bmi);
    if (!inputs.bmi || isNaN(bmi) || bmi < 10 || bmi > 50) {
      newErrors.bmi = 'Please enter a valid BMI between 10 and 50';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onPredict({ disease, ...inputs });
    }
  };

  const getAgeLabel = (group) => {
    const labels = {
      1: "18-24", 2: "25-29", 3: "30-34", 4: "35-39", 5: "40-44",
      6: "45-49", 7: "50-54", 8: "55-59", 9: "60-64", 10: "65-69",
      11: "70-74", 12: "75-79", 13: "80+"
    };
    return labels[group];
  };

  return (
    <div className="bg-dark-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-6">Health Risk Assessment</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Disease</label>
        <div className="flex space-x-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="disease"
              checked={disease === 'diabetes'}
              onChange={() => setDisease('diabetes')}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Type 2 Diabetes</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="disease"
              checked={disease === 'hypertension'}
              onChange={() => setDisease('hypertension')}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Hypertension</span>
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Age Group</label>
          <select
            name="age"
            value={inputs.age}
            onChange={handleChange}
            className="w-full bg-dark-700 border border-dark-600 rounded p-2.5"
          >
            {[...Array(13)].map((_, i) => (
              <option key={i+1} value={i+1}>
                {getAgeLabel(i+1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">BMI (e.g., 25.4)</label>
          <input
            name="bmi"
            type="number"
            step="0.1"
            min="10"
            max="50"
            value={inputs.bmi}
            onChange={handleChange}
            className="w-full bg-dark-700 border border-dark-600 rounded p-2.5"
          />
          {errors.bmi && <p className="text-red-400 text-sm mt-1">{errors.bmi}</p>}
        </div>

        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="physActivity"
              checked={inputs.physActivity}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="ml-2">I exercise 30+ mins/week</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="highBP"
              checked={inputs.highBP}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="ml-2">Diagnosed with high blood pressure</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="highChol"
              checked={inputs.highChol}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="ml-2">Diagnosed with high cholesterol</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="smoker"
              checked={inputs.smoker}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="ml-2">I am a current smoker</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">General Health</label>
          <select
            name="genHlth"
            value={inputs.genHlth}
            onChange={handleChange}
            className="w-full bg-dark-700 border border-dark-600 rounded p-2.5"
          >
            <option value="1">Excellent</option>
            <option value="2">Very Good</option>
            <option value="3">Good</option>
            <option value="4">Fair</option>
            <option value="5">Poor</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-2.5 rounded font-medium transition"
        >
          {loading ? 'Checking...' : 'Check Risk'}
        </button>
      </form>
    </div>
  );
}