import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';
import './AdminFacultyFeedback.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const FacultyFeedbackAnalytics = () => {
  const [facultyData, setFacultyData] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFacultyAnalytics = async () => {
        try {
          // Assuming selectedFaculty is the instructor's ID
          const response = await fetch('/api/faculty-feedback-analytics');
          if (!response.ok) {
            throw new Error('Failed to fetch faculty analytics');
          }
          const data = await response.json();
          setFacultyData(data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
      

    fetchFacultyAnalytics();
  }, []);

  const transformDataForOverallRatingPieChart = () => {
    if (!selectedFaculty) return [];

    return [
      { name: 'Excellent', value: selectedFaculty.excellentRatingsCount },
      { name: 'Good', value: selectedFaculty.goodRatingsCount },
      { name: 'Average', value: selectedFaculty.averageRatingsCount },
      { name: 'Fair', value: selectedFaculty.fairRatingsCount },
      { name: 'Poor', value: selectedFaculty.poorRatingsCount }
    ];
  };

  const renderOverallRatingPieChart = () => {
    const pieData = transformDataForOverallRatingPieChart();

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderRatingBreakdownBarChart = () => {
    if (!selectedFaculty) return null;

    const barData = [
      { 
        category: 'Material Explanation', 
        rating: selectedFaculty.materialExplanationRating 
      },
      { 
        category: 'Objectives Clarity', 
        rating: selectedFaculty.objectivesClarityRating 
      },
      { 
        category: 'Content Relevance', 
        rating: selectedFaculty.contentRelevanceRating 
      },
      { 
        category: 'Assignment Clarity', 
        rating: selectedFaculty.assignmentClarityRating 
      },
      { 
        category: 'Grading Criteria', 
        rating: selectedFaculty.gradingCriteriaRating 
      }
    ];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis domain={[0, 5]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="rating" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="faculty-feedback-analytics">
      <h2>Faculty Feedback Analytics</h2>
      
      <div className="faculty-selector">
        <label>Select Faculty: </label>
        <select 
          onChange={(e) => setSelectedFaculty(
            facultyData.find(f => f.instructorName === e.target.value)
          )}
        >
          <option value="">Select a faculty member</option>
          {facultyData.map(faculty => (
            <option key={faculty.instructorName} value={faculty.instructorName}>
              {faculty.instructorName}
            </option>
          ))}
        </select>
      </div>

      {selectedFaculty && (
        <div className="faculty-analytics-details">
          <div className="faculty-summary">
            <h3>Analytics for {selectedFaculty.instructorName}</h3>
            <div className="summary-stats">
              <div className="stat-card">
                <h4>Overall Rating</h4>
                <p>{selectedFaculty.overallRating.toFixed(2)} / 5</p>
              </div>
              <div className="stat-card">
                <h4>Total Feedback Responses</h4>
                <p>{selectedFaculty.totalFeedbackResponses}</p>
              </div>
            </div>
          </div>

          <div className="charts-container">
            <div className="chart-section">
              <h4>Rating Distribution</h4>
              {renderOverallRatingPieChart()}
            </div>
            <div className="chart-section">
              <h4>Rating Breakdown by Category</h4>
              {renderRatingBreakdownBarChart()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyFeedbackAnalytics;