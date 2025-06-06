import React, { useState, useRef } from 'react';
import { 
  BookPlus, 
  Calendar, 
  Layers, 
  FileText, 
  User, 
  BookOpen, 
  Check, 
  X, 
  Loader2 
} from 'lucide-react';
import './AdminCourseFeedback.css';

function CreateCourse() {
    // Academic years and their associated courses
    const academicYearCourses = {
        '2022-2023': [
            { value: 'CS101', label: 'Introduction to Programming' },
            { value: 'MATH201', label: 'Calculus I' },
            { value: 'PHY101', label: 'Physics Fundamentals' },
            { value: 'ENG102', label: 'Technical Writing' },
            { value: 'STAT101', label: 'Basic Statistics' }
        ],
        '2023-2024': [
            { value: 'CS201', label: 'Data Structures' },
            { value: 'MATH301', label: 'Linear Algebra' },
            { value: 'CS205', label: 'Computer Networks' },
            { value: 'DBMS101', label: 'Database Management' },
            { value: 'AI101', label: 'Artificial Intelligence Basics' }
        ],
        '2024-2025': [
            { value: 'ML201', label: 'Machine Learning' },
            { value: 'CS301', label: 'Software Engineering' },
            { value: 'CLOUD101', label: 'Cloud Computing' },
            { value: 'SEC201', label: 'Cybersecurity Fundamentals' },
            { value: 'DATA201', label: 'Big Data Analytics' }
        ]
    };

    const [courseData, setCourseData] = useState({
        courseName: '',
        courseCode: '',
        description: '',
        department: '',
        credits: '',
        instructor: '',
        academicYear: '',
        predefinedCourse: ''
    });

    const [formStatus, setFormStatus] = useState({
        isSubmitting: false,
        message: '',
        type: ''
    });

    const formRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourseData(prev => ({
            ...prev,
            [name]: value,
            // Reset course details if academic year changes
            ...(name === 'academicYear' && { 
                predefinedCourse: '',
                courseName: '',
                courseCode: ''
            })
        }));
    };

    const handlePredefinedCourseChange = (e) => {
        const selectedCourse = e.target.value;
        const selectedYear = courseData.academicYear;
        
        if (selectedCourse && selectedYear) {
            const courseDetails = academicYearCourses[selectedYear]
                .find(course => course.value === selectedCourse);
            
            setCourseData(prev => ({
                ...prev,
                predefinedCourse: selectedCourse,
                courseName: courseDetails ? courseDetails.label : '',
                courseCode: selectedCourse
            }));
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        
        // Additional validation for academic year
        if (!courseData.academicYear) {
            setFormStatus({
                isSubmitting: false,
                message: 'Please select an Academic Year',
                type: 'error'
            });
            return;
        }
        
        // If not using a predefined course, ensure manual entry is complete
        if (!courseData.predefinedCourse && 
            (!courseData.courseName || !courseData.courseCode)) {
            setFormStatus({
                isSubmitting: false,
                message: 'Please enter Course Name and Course Code',
                type: 'error'
            });
            return;
        }

        // Rest of the existing submission logic...
        setFormStatus({ isSubmitting: true, message: '', type: '' });

        try {
            const response = await fetch('/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...courseData,
                    academicYear: courseData.academicYear
                })
            });

            if (response.ok) {
                // Success handling remains the same
                setFormStatus({
                    isSubmitting: false,
                    message: 'Course Created Successfully!',
                    type: 'success'
                });

                // Reset form
                setCourseData({
                    courseName: '',
                    courseCode: '',
                    description: '',
                    department: '',
                    credits: '',
                    instructor: '',
                    academicYear: '',
                    predefinedCourse: ''
                });

                // Trigger form reset animation
                formRef.current.classList.add('form-reset');
                setTimeout(() => {
                    formRef.current.classList.remove('form-reset');
                }, 1000);
            } else {
                // Error handling
                const errorData = await response.json();
                setFormStatus({
                    isSubmitting: false,
                    message: errorData.message || 'Failed to Create Course',
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('Error creating course:', error);
            setFormStatus({
                isSubmitting: false,
                message: 'Network Error. Please try again.',
                type: 'error'
            });
        }
    };

    const departments = [
        { value: 'computer-science', label: 'Computer Science' },
        { value: 'csit', label: 'CSIT' },
        { value: 'aids', label: 'AIDS' },
        { value: 'ece', label: 'ECE' }
    ];

    const academicYears = [
        { value: '2022-2023', label: '2022-2023' },
        { value: '2023-2024', label: '2023-2024' },
        { value: '2024-2025', label: '2024-2025' }
    ];

  return (
        <div className="course-creation-container">
            <div className="course-creation-wrapper">
                <form 
                    ref={formRef}
                    onSubmit={handleCreateCourse} 
                    className="course-form"
                >
                    <div className="form-header">
                        <BookPlus className="form-icon" />
                        <h2 className="form-title">Create New Course</h2>
                    </div>
                    
                    {formStatus.message && (
                        <div className={`form-message ${formStatus.type}`}>
                            {formStatus.type === 'success' ? <Check /> : <X />}
                            {formStatus.message}
                        </div>
                    )}

                    <div className="form-grid">
                        {/* Academic Year Dropdown */}
                        <div className="form-group">
                            <label htmlFor="academicYear">
                                <Calendar className="input-icon" />
                                Academic Year
                            </label>
                            <select
                                id="academicYear"
                                name="academicYear"
                                value={courseData.academicYear}
                                onChange={handleInputChange}
                                required
                                className="form-input"
                            >
                                <option value="">Select Academic Year</option>
                                {academicYears.map(year => (
                                    <option key={year.value} value={year.value}>
                                        {year.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Predefined Courses Dropdown */}
                        {courseData.academicYear && (
                            <div className="form-group">
                                <label htmlFor="predefinedCourse">
                                    <Layers className="input-icon" />
                                    Predefined Courses
                                </label>
                                <select
                                    id="predefinedCourse"
                                    name="predefinedCourse"
                                    value={courseData.predefinedCourse}
                                    onChange={handlePredefinedCourseChange}
                                    className="form-input"
                                >
                                    <option value="">Select a Course (Optional)</option>
                                    {academicYearCourses[courseData.academicYear].map(course => (
                                        <option key={course.value} value={course.value}>
                                            {course.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Course Name */}
                        <div className="form-group">
                            <label htmlFor="courseName">
                                <BookOpen className="input-icon" />
                                Course Name
                            </label>
                            <input
                                id="courseName"
                                type="text"
                                name="courseName"
                                value={courseData.courseName}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter course name"
                                disabled={!!courseData.predefinedCourse}
                                className="form-input"
                            />
                        </div>

                        {/* Course Code */}
                        <div className="form-group">
                            <label htmlFor="courseCode">
                                <FileText className="input-icon" />
                                Course Code
                            </label>
                            <input
                                id="courseCode"
                                type="text"
                                name="courseCode"
                                value={courseData.courseCode}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter course code"
                                disabled={!!courseData.predefinedCourse}
                                className="form-input"
                            />
                        </div>

                        {/* Description */}
                        <div className="form-group full-width">
                            <label htmlFor="description">
                                <FileText className="input-icon" />
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={courseData.description}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter course description"
                                className="form-input textarea"
                            />
                        </div>

                        {/* Department */}
                        <div className="form-group">
                            <label htmlFor="department">
                                <Layers className="input-icon" />
                                Department
                            </label>
                            <select
                                id="department"
                                name="department"
                                value={courseData.department}
                                onChange={handleInputChange}
                                required
                                className="form-input"
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.value} value={dept.value}>
                                        {dept.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Credits */}
                        <div className="form-group">
                            <label htmlFor="credits">
                                <BookPlus className="input-icon" />
                                Credits
                            </label>
                            <input
                                id="credits"
                                type="number"
                                name="credits"
                                value={courseData.credits}
                                onChange={handleInputChange}
                                required
                                min="1"
                                max="10"
                                placeholder="Course credits"
                                className="form-input"
                            />
                        </div>

                        {/* Instructor */}
                        <div className="form-group">
                            <label htmlFor="instructor">
                                <User className="input-icon" />
                                Instructor
                            </label>
                            <input
                                id="instructor"
                                type="text"
                                name="instructor"
                                value={courseData.instructor}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter instructor name"
                                className="form-input"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="form-group full-width">
                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={formStatus.isSubmitting}
                            >
                                {formStatus.isSubmitting ? (
                                    <>
                                        <Loader2 className="button-icon spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Course'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateCourse;