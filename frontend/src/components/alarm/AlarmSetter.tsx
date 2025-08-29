import React, { useState, useEffect } from 'react';
import { useAlarm } from './AlarmContext';

const AlarmSetter: React.FC = () => {
  const [formData, setFormData] = useState({
    alarmName: '',
    time: '',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    puzzleType: 'math' as 'math' | 'memory' | 'pattern',
    puzzleDifficulty: 'easy' as 'easy' | 'medium' | 'hard',
    alarmTone: 'gentle' as 'gentle' | 'nature' | 'classic' | 'energetic',
    maxSnooze: 3,
    vibration: false,
  });

  const { createAlarm, fetchAlarms, loading, error, clearError } = useAlarm();

  useEffect(() => {
    fetchAlarms();
    return () => clearError();
  }, [fetchAlarms, clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleDayChange = (day: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.alarmName || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.days.length === 0) {
      alert('Please select at least one day');
      return;
    }

    try {
      await createAlarm(formData);
      setFormData({
        alarmName: '',
        time: '',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        puzzleType: 'math',
        puzzleDifficulty: 'easy',
        alarmTone: 'gentle',
        maxSnooze: 3,
        vibration: false,
      });
      alert('Alarm created successfully!');
    } catch (error) {
      console.error('Failed to create alarm:', error);
    }
  };

  const days = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-2">⏰ Morning Alarm</h1>
            <p className="text-gray-600">Set your wake-up alarm with puzzle challenge</p>
          </div>

          {/* Alarm Creation Form */}
          <div className="card bg-white/90 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Alarm Name */}
                <div>
                  <label className="form-label">Alarm Name</label>
                  <input
                    type="text"
                    name="alarmName"
                    value={formData.alarmName}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., Morning Workout"
                    required
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="form-label">Wake-up Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Days Selection */}
              <div>
                <label className="form-label">Repeat Days</label>
                <div className="flex flex-wrap gap-2">
                  {days.map((day) => (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() => handleDayChange(day.key)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.days.includes(day.key)
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Puzzle Settings */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Puzzle Type</label>
                  <select
                    name="puzzleType"
                    value={formData.puzzleType}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="math">Math Problem</option>
                    <option value="memory">Memory Game</option>
                    <option value="pattern">Pattern Recognition</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Puzzle Difficulty</label>
                  <select
                    name="puzzleDifficulty"
                    value={formData.puzzleDifficulty}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Alarm Settings */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Alarm Tone</label>
                  <select
                    name="alarmTone"
                    value={formData.alarmTone}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="gentle">Gentle Wake</option>
                    <option value="nature">Nature Sounds</option>
                    <option value="classic">Classic Bell</option>
                    <option value="energetic">Energetic Beat</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Max Snooze Count</label>
                  <select
                    name="maxSnooze"
                    value={formData.maxSnooze}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value={1}>1 time</option>
                    <option value={2}>2 times</option>
                    <option value={3}>3 times</option>
                    <option value={5}>5 times</option>
                  </select>
                </div>
              </div>

              {/* Vibration Toggle */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="vibration"
                  name="vibration"
                  checked={formData.vibration}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="vibration" className="text-gray-700 font-medium">
                  Enable vibration (mobile devices)
                </label>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-wellness w-full flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Alarm...
                  </>
                ) : (
                  <>
                    <span className="mr-2">⏰</span>
                    Create Alarm
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Tips */}
          <div className="mt-8 card bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-3">💡 Alarm Tips</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Choose a puzzle difficulty that will wake you up without being too frustrating</li>
              <li>• Math puzzles are great for logical thinking in the morning</li>
              <li>• Memory games help improve cognitive function</li>
              <li>• Limit snooze to avoid disrupting your sleep cycle</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmSetter;
