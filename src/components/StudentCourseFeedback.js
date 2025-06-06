import React, { useState, useEffect } from 'react';
import { 
  MessageSquare,  
  X 
} from 'lucide-react';
import './StudentCourseFeedback.css';

function CourseFeedback() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [feedbackData, setFeedbackData] = useState({
        courseId: '',
        rating: 0,
        comment: '',
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('/api/courses');
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        setFeedbackData((prev) => ({
            ...prev,
            courseId: course.id,
        }));
    };

    const handleFeedbackChange = (e) => {
        const { name, value } = e.target;
        setFeedbackData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const submitFeedback = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedbackData),
            });

            if (response.ok) {
                alert('Feedback Submitted Successfully');
                setSelectedCourse(null);
                setFeedbackData({
                    courseId: '',
                    rating: 0,
                    comment: '',
                });
            } else {
                alert('Failed to Submit Feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    const closeModal = () => {
        setSelectedCourse(null);
    };

    return (
        <div className="student-course-feedback">
            <div className="student-course-feedback__header">
                <MessageSquare size={24} className="student-course-feedback__icon" />
                <h2>Course Feedback</h2>
            </div>

            <div className="student-course-feedback__grid">
                {Array.isArray(courses) && courses.length > 0 ? (
                    courses.map((course) => (
                        <div
                            key={course.id}
                            className="student-course-card"
                            onClick={() => handleCourseSelect(course)}
                        >
                            <div className="student-course-card__content">
                                <h3>{course.courseName}</h3>
                                <p>{course.courseCode}</p>
                                <p className="student-course-card__department">{course.department}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="student-course-feedback__empty">
                        <p>No courses available</p>
                    </div>
                )}
            </div>

            {selectedCourse && (
                <div className="student-feedback-modal">
                    <div className="student-feedback-modal__content">
                        <button 
                            className="student-feedback-modal__close" 
                            onClick={closeModal}
                        >
                            <X size={24} />
                        </button>
                        <h2>Provide Feedback for {selectedCourse.courseName}</h2>
                        <form onSubmit={submitFeedback} className="student-feedback-form">
                            <div className="student-form-group">
                                <label>Course</label>
                                <input
                                    type="text"
                                    value={selectedCourse.courseName}
                                    disabled
                                />
                            </div>
                            <div className="student-form-group">
                                <label>Rating</label>
                                <select
                                    name="rating"
                                    value={feedbackData.rating}
                                    onChange={handleFeedbackChange}
                                    required
                                >
                                    <option value="">Select Rating</option>
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <option key={rating} value={rating}>
                                            {rating} {rating === 1 ? 'Star' : 'Stars'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="student-form-group">
                                <label>Comments</label>
                                <textarea
                                    name="comment"
                                    value={feedbackData.comment}
                                    onChange={handleFeedbackChange}
                                    placeholder="Share your detailed feedback"
                                    required
                                />
                            </div>
                            <div className="student-form-actions">
                                <button 
                                    type="submit" 
                                    className="student-btn student-btn-primary"
                                >
                                    Submit Feedback
                                </button>
                                <button
                                    type="button"
                                    className="student-btn student-btn-secondary"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CourseFeedback;