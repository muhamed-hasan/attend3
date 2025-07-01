'use client';

import { useState, useEffect } from 'react';

export function AttendanceTable() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedDateRange, setSelectedDateRange] = useState('30');
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    const [selectedShift, setSelectedShift] = useState('All');
    const [searchEmployee, setSearchEmployee] = useState('');

    // Sample employee data
    const employees = [
        { id: 9, firstName: 'Mohammed', lastName: 'Adel', department: 'Heidelberg', shift: 'Day' },
        {
            id: 8,
            firstName: 'Nady',
            lastName: 'Hanna Anwer',
            department: 'Abo Kastore',
            shift: 'Day',
        },
        {
            id: 71,
            firstName: 'Wael',
            lastName: 'Farouk ABDELHAMEED',
            department: 'Naser',
            shift: 'Night',
        },
        {
            id: 70,
            firstName: 'Mohamed',
            lastName: 'Amin Mostafa',
            department: 'Naser',
            shift: 'Night',
        },
        {
            id: 7,
            firstName: 'Hassan',
            lastName: 'Mohammed Rashed',
            department: 'Naser',
            shift: 'Day',
        },
        {
            id: 69,
            firstName: 'Abdallah',
            lastName: 'Hasan Eed Hasan',
            department: 'Naser',
            shift: 'Night',
        },
        {
            id: 68,
            firstName: 'Saber',
            lastName: 'mohamed Abdelghany',
            department: 'Naser',
            shift: 'Night',
        },
        { id: 67, firstName: 'Samweel', lastName: 'Adel', department: 'Abo Kastore', shift: 'Day' },
        { id: 65, firstName: 'Gamal', lastName: 'Nasr', department: 'Naser', shift: 'Night' },
        {
            id: 64,
            firstName: 'Sameh',
            lastName: 'Mohamed Mahmoud',
            department: 'Abo Kastore',
            shift: 'Day',
        },
        {
            id: 63,
            firstName: 'Tarek',
            lastName: 'Ahmed',
            department: 'All Departments',
            shift: 'Day',
        },
        {
            id: 62,
            firstName: 'Mahmoud',
            lastName: 'Reda Mahmoud',
            department: 'Naser',
            shift: 'Night',
        },
        {
            id: 61,
            firstName: 'Sherif',
            lastName: 'Mansour Sayed',
            department: 'Naser',
            shift: 'Night',
        },
        {
            id: 60,
            firstName: 'Sayed',
            lastName: 'Bahaa Ismail',
            department: 'Naser',
            shift: 'Night',
        },
        { id: 6, firstName: 'Amro', lastName: 'Fathy', department: 'Heidelberg', shift: 'Day' },
        {
            id: 59,
            firstName: 'Yousef',
            lastName: 'Wahid YOUNES',
            department: 'Naser',
            shift: 'Night',
        },
        {
            id: 58,
            firstName: 'Walied',
            lastName: 'Wagdy Abdelmotagally',
            department: 'Naser',
            shift: 'Night',
        },
        {
            id: 57,
            firstName: 'Abdelnabi',
            lastName: 'Ahmed Mahmoud',
            department: 'Naser',
            shift: 'Night',
        },
        {
            id: 56,
            firstName: 'Monyr',
            lastName: 'Fathy Abdelgwad',
            department: 'Naser',
            shift: 'Night',
        },
        {
            id: 55,
            firstName: 'Salem',
            lastName: 'Mohamed Aly',
            department: 'Naser',
            shift: 'Night',
        },
        { id: 54, firstName: 'Ehab', lastName: 'Sayed Ahmed', department: 'Naser', shift: 'Night' },
        {
            id: 53,
            firstName: 'Ahmed',
            lastName: 'Nagib Mahmoud',
            department: 'Naser',
            shift: 'Night',
        },
        {
            id: 52,
            firstName: 'Mamdouh',
            lastName: 'Abdelazim Aly',
            department: 'All Departments',
            shift: 'Day',
        },
        {
            id: 51,
            firstName: 'MOHAMED',
            lastName: 'Kurany Hosain',
            department: 'All Departments',
            shift: 'Day',
        },
        {
            id: 50,
            firstName: 'Magdy',
            lastName: 'Rabee Mlotwally',
            department: 'Naser',
            shift: 'Night',
        },
        { id: 5, firstName: 'Ahmed', lastName: 'Hosny', department: 'SDS', shift: 'Day' },
        {
            id: 49,
            firstName: 'Khedr',
            lastName: 'Salem khedr',
            department: 'Naser',
            shift: 'Night',
        },
        {
            id: 48,
            firstName: 'Esam',
            lastName: 'Mostafa Mahmoud',
            department: 'Naser',
            shift: 'Night',
        },
    ];

    // Generate random attendance data for last 30 days
    const generateAttendanceData = () => {
        const data: any[] = [];
        const today = new Date();

        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            employees.forEach((employee) => {
                const isPresent = Math.random() > 0.15; // 85% attendance rate

                if (isPresent) {
                    let loginTime, logoutTime;

                    if (employee.shift === 'Day') {
                        // Day shift: 05:00-09:00 login
                        const loginHour = 5 + Math.random() * 4;
                        const loginMinute = Math.random() * 60;
                        loginTime = new Date(date);
                        loginTime.setHours(Math.floor(loginHour), Math.floor(loginMinute));

                        // 8-9 hours later
                        logoutTime = new Date(loginTime);
                        logoutTime.setHours(logoutTime.getHours() + 8 + Math.random());
                    } else {
                        // Night shift: 17:00-21:00 login
                        const loginHour = 17 + Math.random() * 4;
                        const loginMinute = Math.random() * 60;
                        loginTime = new Date(date);
                        loginTime.setHours(Math.floor(loginHour), Math.floor(loginMinute));

                        // 8-9 hours later (next day)
                        logoutTime = new Date(loginTime);
                        logoutTime.setHours(logoutTime.getHours() + 8 + Math.random());
                    }

                    const totalHours = (logoutTime.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
                    const isLate =
                        (employee.shift === 'Day' && loginTime.getHours() >= 8) ||
                        (employee.shift === 'Night' && loginTime.getHours() >= 19);

                    data.push({
                        date: date.toISOString().split('T')[0],
                        employeeId: employee.id,
                        fullName: `${employee.firstName} ${employee.lastName}`,
                        department: employee.department,
                        shift: employee.shift,
                        loginTime: loginTime.toTimeString().slice(0, 5),
                        logoutTime: logoutTime.toTimeString().slice(0, 5),
                        totalHours: totalHours.toFixed(1),
                        status: isLate ? 'late' : 'ontime',
                    });
                } else {
                    data.push({
                        date: date.toISOString().split('T')[0],
                        employeeId: employee.id,
                        fullName: `${employee.firstName} ${employee.lastName}`,
                        department: employee.department,
                        shift: employee.shift,
                        loginTime: '-',
                        logoutTime: '-',
                        totalHours: '0',
                        status: 'absent',
                    });
                }
            });
        }

        return data;
    };

    const [attendanceData] = useState(generateAttendanceData());

    // Auto-refresh every 15 minutes
    useEffect(() => {
        const interval = setInterval(
            () => {
                setCurrentTime(new Date());
            },
            15 * 60 * 1000,
        );

        return () => clearInterval(interval);
    }, []);

    // Filter data based on selections
    const filteredData = attendanceData.filter((record: any) => {
        const matchesDepartment =
            selectedDepartment === 'All' || record.department === selectedDepartment;
        const matchesShift = selectedShift === 'All' || record.shift === selectedShift;
        const matchesSearch =
            searchEmployee === '' ||
            record.fullName.toLowerCase().includes(searchEmployee.toLowerCase());

        return matchesDepartment && matchesShift && matchesSearch;
    });

    // Calculate statistics
    const totalEmployees = employees.length;
    const todayData = attendanceData.filter(
        (record: any) => record.date === new Date().toISOString().split('T')[0],
    );
    const presentToday = todayData.filter((record: any) => record.status !== 'absent').length;
    const absentToday = totalEmployees - presentToday;
    const attendanceRate = totalEmployees > 0 ? ((presentToday / totalEmployees) * 100).toFixed(1) : '0';

    // Department distribution
    const departmentStats: { [key: string]: number } = {};
    employees.forEach((emp: any) => {
        departmentStats[emp.department] = (departmentStats[emp.department] || 0) + 1;
    });

    // Shift distribution
    const shiftStats: { [key: string]: number } = {};
    employees.forEach((emp: any) => {
        shiftStats[emp.shift] = (shiftStats[emp.shift] || 0) + 1;
    });

    const departments = [...new Set(employees.map((emp: any) => emp.department))];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Employee Attendance Dashboard
                    </h1>
                    <div className="text-sm text-gray-600">
                        Last updated: {currentTime.toLocaleTimeString()}
                    </div>
                </div>
            </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date Range
                            </label>
                            <select
                                value={selectedDateRange}
                                onChange={(e) => setSelectedDateRange(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="7">Last 7 days</option>
                                <option value="30">Last 30 days</option>
                                <option value="90">Last 90 days</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Department
                            </label>
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="All">All Departments</option>
                                {departments.map((dept: any) => (
                                    <option key={dept} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Shift
                            </label>
                            <select
                                value={selectedShift}
                                onChange={(e) => setSelectedShift(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="All">All Shifts</option>
                                <option value="Day">Day Shift</option>
                                <option value="Night">Night Shift</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Search Employee
                            </label>
                            <input
                                type="text"
                                value={searchEmployee}
                                onChange={(e) => setSearchEmployee(e.target.value)}
                                placeholder="Enter employee name..."
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Employees</p>
                            <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <svg
                                className="w-6 h-6 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Present Today</p>
                            <p className="text-3xl font-bold text-green-600">{presentToday}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <svg
                                className="w-6 h-6 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Absent Today</p>
                            <p className="text-3xl font-bold text-red-600">{absentToday}</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full">
                            <svg
                                className="w-6 h-6 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                            <p className="text-3xl font-bold text-blue-600">{attendanceRate}%</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <svg
                                className="w-6 h-6 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Department Distribution */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Department Distribution
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(departmentStats).map(([dept, count]) => (
                            <div key={dept} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{dept}</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${(count / totalEmployees) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-800">
                                        {count}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shift Distribution */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Shift Distribution</h3>
                    <div className="space-y-3">
                        {Object.entries(shiftStats).map(([shift, count]) => (
                            <div key={shift} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{shift} Shift</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-indigo-600 h-2 rounded-full"
                                            style={{ width: `${(count / totalEmployees) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-800">
                                        {count}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* TABLE_PLACEHOLDER */}
        </div>
    );
}
