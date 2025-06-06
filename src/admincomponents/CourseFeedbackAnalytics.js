import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import './CourseFeedbackAnalytics.css';

const FeedbackAnalytics = () => {
    const [feedbackData, setFeedbackData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Colors for pie chart and bar chart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    useEffect(() => {
        const fetchFeedbackData = async () => {
            try {
                // Adjust the API endpoint as per your backend configuration
                const response = await axios.get('/api/feedback/analytics');
                setFeedbackData(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch feedback data');
                setLoading(false);
            }
        };

        fetchFeedbackData();
    }, []);

    // Prepare data for course-wise rating distribution
    const prepareCourseRatingData = () => {
        if (!feedbackData.courseFeedbacks) return [];

        return feedbackData.courseFeedbacks.map(course => ({
            name: course.courseName,
            averageRating: course.averageRating,
            totalFeedbacks: course.totalFeedbacks
        }));
    };

    // Prepare data for rating distribution pie chart
    const prepareRatingDistributionData = () => {
        if (!feedbackData.ratingDistribution) return [];

        return Object.entries(feedbackData.ratingDistribution).map(([rating, count]) => ({
            name: `${rating} Star`,
            value: count
        }));
    };

    if (loading) return <div>Loading feedback analytics...</div>;
    if (error) return <div>{error}</div>;

    const courseRatingData = prepareCourseRatingData();
    const ratingDistributionData = prepareRatingDistributionData();

    return (
        <div className="feedback-analytics">
            <h2>Feedback Analytics</h2>
            
            <div className="analytics-section">
                <h3>Course Rating Distribution</h3>
                <BarChart width={600} height={300} data={courseRatingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="averageRating" fill="#8884d8" name="Average Rating" />
                    <Bar dataKey="totalFeedbacks" fill="#82ca9d" name="Total Feedbacks" />
                </BarChart>
            </div>

            <div className="analytics-section">
                <h3>Overall Rating Distribution</h3>
                <PieChart width={400} height={300}>
                    <Pie
                        data={ratingDistributionData}
                        cx={200}
                        cy={150}
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                        {ratingDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>

            <div className="summary-section">
                <h3>Feedback Summary</h3>
                <div className="summary-grid">
                    <div className="summary-card">
                        <h4>Total Feedbacks</h4>
                        <p>{feedbackData.totalFeedbacks}</p>
                    </div>
                    <div className="summary-card">
                        <h4>Average Rating</h4>
                        <p>{feedbackData.averageRating?.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackAnalytics;