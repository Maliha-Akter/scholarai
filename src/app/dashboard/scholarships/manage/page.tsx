"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession, authClient } from "@/app/lib/auth-client";
import toast, { Toaster } from "react-hot-toast";
import { Pencil, Trash2, X, GraduationCap, MapPin, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import Link from "next/link";

interface Scholarship {
    _id: string;
    title: string;
    universityName: string;
    country: string;
    degree: string;
    fundingType: string;
    applicationDeadline: string;
    isActive: boolean;
}

export default function ManageScholarships() {
    const { data: session, isPending } = useSession();
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modal States
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

    // Form State for Edit
    const [formData, setFormData] = useState<Partial<Scholarship>>({});

    // Stabilized fetch function
    const fetchMyScholarships = useCallback(async () => {
        const email = session?.user?.email;
        if (!email) return;

        try {
            const tokenResponse = await authClient.token();
            const token = tokenResponse?.data?.token;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scholarships?userId=${email}&page=${currentPage}&limit=6`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();

            // Safely fallback to an empty array to prevent .length crashes
            setScholarships(data.scholarships || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            toast.error("Failed to load scholarships.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [session?.user?.email, currentPage]);

    useEffect(() => {
        let isMounted = true;

        const initializeData = async () => {
            if (!isPending) {
                if (session?.user?.email) {
                    if (isMounted) {
                        await fetchMyScholarships();
                    }
                } else {
                    if (isMounted) {
                        setIsLoading(false);
                    }
                }
            }
        };

        initializeData();

        return () => {
            isMounted = false;
        };
    }, [isPending, session?.user?.email, fetchMyScholarships]);

    // --- Delete Handlers ---
    const confirmDelete = (scholarship: Scholarship) => {
        setSelectedScholarship(scholarship);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedScholarship) return;

        try {
            const tokenResponse = await authClient.token();
            const token = tokenResponse?.data?.token;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scholarships/${selectedScholarship._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                toast.success("Scholarship deleted successfully!");
                setDeleteModalOpen(false);

                if (scholarships.length === 1 && currentPage > 1) {
                    setCurrentPage(prev => prev - 1);
                } else {
                    fetchMyScholarships();
                }
            } else {
                throw new Error("Failed to delete");
            }
        } catch (error) {
            toast.error("An error occurred while deleting.");
            console.error(error);
        }
    };

    // --- Edit Handlers ---
    const openEditModal = (scholarship: Scholarship) => {
        setSelectedScholarship(scholarship);
        setFormData({
            title: scholarship.title,
            universityName: scholarship.universityName,
            country: scholarship.country,
            degree: scholarship.degree,
            fundingType: scholarship.fundingType,
            applicationDeadline: scholarship.applicationDeadline
        });
        setEditModalOpen(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedScholarship) return;

        try {
            const tokenResponse = await authClient.token();
            const token = tokenResponse?.data?.token;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scholarships/${selectedScholarship._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success("Scholarship updated successfully!");
                fetchMyScholarships();
                setEditModalOpen(false);
            } else {
                throw new Error("Failed to update");
            }
        } catch (error) {
            toast.error("An error occurred while updating.");
            console.error(error);
        }
    };

    if (isPending || isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900">
                Please log in to manage your scholarships.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <Toaster position="top-right" />

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Manage Scholarships</h1>
                        <p className="text-slate-500 mt-1 text-sm sm:text-base">View, edit, or remove your posted opportunities.</p>
                    </div>
                    <Link
                        href="/dashboard/scholarships/add"
                        className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm shadow-blue-700/20 transition-all inline-flex items-center justify-center"
                    >
                        + Add New Scholarship
                    </Link>
                </div>

                {/* Empty State */}
                {scholarships.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 shadow-sm">
                        No scholarships found. Start by adding one!
                    </div>
                ) : (
                    <>
                        {/* --- MOBILE & TABLET CARD VIEW (< md) --- */}
                        <div className="block lg:hidden space-y-4">
                            {scholarships.map((scholarship) => (
                                <div key={scholarship._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mb-2 ${scholarship.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {scholarship.isActive ? 'Active' : 'Draft'}
                                            </span>
                                            <h3 className="font-bold text-slate-900 text-base leading-snug">{scholarship.title}</h3>
                                            <p className="text-sm text-slate-500 flex items-center mt-1">
                                                <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0 text-slate-400" />
                                                {scholarship.universityName}, {scholarship.country}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <button onClick={() => openEditModal(scholarship)} className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors" title="Edit">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => confirmDelete(scholarship)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs sm:text-sm">
                                        <div>
                                            <span className="text-xs text-slate-400 block mb-1 font-medium">Degree & Funding</span>
                                            <div className="text-slate-900 font-medium flex items-center">
                                                <GraduationCap className="w-4 h-4 mr-1.5 text-violet-600 flex-shrink-0" />
                                                {scholarship.degree}
                                            </div>
                                            <div className="text-amber-600 font-medium mt-0.5">
                                                {scholarship.fundingType}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-xs text-slate-400 block mb-1 font-medium">Deadline</span>
                                            <div className="text-slate-700 font-medium flex items-center">
                                                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400 flex-shrink-0" />
                                                {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* --- DESKTOP TABLE VIEW (≥ md) --- */}
                        <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-900 text-slate-50 border-b border-slate-200">
                                            <th className="py-4 px-6 font-semibold">Scholarship Info</th>
                                            <th className="py-4 px-6 font-semibold">Degree & Funding</th>
                                            <th className="py-4 px-6 font-semibold">Deadline</th>
                                            <th className="py-4 px-6 font-semibold">Status</th>
                                            <th className="py-4 px-6 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scholarships.map((scholarship) => (
                                            <tr key={scholarship._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                                <td className="py-4 px-6">
                                                    <div className="font-bold text-slate-900">{scholarship.title}</div>
                                                    <div className="text-sm text-slate-500 flex items-center mt-1">
                                                        <MapPin className="w-3.5 h-3.5 mr-1" />
                                                        {scholarship.universityName}, {scholarship.country}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-slate-900 flex items-center">
                                                        <GraduationCap className="w-4 h-4 mr-2 text-violet-600" />
                                                        {scholarship.degree}
                                                    </div>
                                                    <div className="text-sm text-amber-600 font-medium mt-1">
                                                        {scholarship.fundingType}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-slate-700 font-medium">
                                                    {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${scholarship.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                                        {scholarship.isActive ? 'Active' : 'Draft'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => openEditModal(scholarship)} className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors" title="Edit">
                                                            <Pencil className="w-5 h-5" />
                                                        </button>
                                                        <button onClick={() => confirmDelete(scholarship)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-6 bg-white rounded-xl border border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
                        <span className="text-sm text-slate-600">
                            Page <span className="font-semibold text-slate-900">{currentPage}</span> of <span className="font-semibold text-slate-900">{totalPages}</span>
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-slate-600" />
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Pencil className="w-5 h-5 text-violet-600" />
                                Edit Scholarship
                            </h2>
                            <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Scholarship Title</label>
                                <input
                                    type="text" name="title" required
                                    value={formData.title || ""} onChange={handleFormChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">University Name</label>
                                    <input
                                        type="text" name="universityName" required
                                        value={formData.universityName || ""} onChange={handleFormChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Country</label>
                                    <input
                                        type="text" name="country" required
                                        value={formData.country || ""} onChange={handleFormChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Degree Level</label>
                                    <select
                                        name="degree" value={formData.degree || ""} onChange={handleFormChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    >
                                        <option value="Bachelor">Bachelor</option>
                                        <option value="Master">Master</option>
                                        <option value="PhD">PhD</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Funding Type</label>
                                    <select
                                        name="fundingType" value={formData.fundingType || ""} onChange={handleFormChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    >
                                        <option value="Fully Funded">Fully Funded</option>
                                        <option value="Partially Funded">Partially Funded</option>
                                        <option value="Self Funded">Self Funded</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Application Deadline</label>
                                <input
                                    type="date" name="applicationDeadline" required
                                    value={formData.applicationDeadline ? formData.applicationDeadline.toString().split('T')[0] : ""}
                                    onChange={handleFormChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setEditModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-6 py-2.5 bg-blue-700 text-white font-medium rounded-xl hover:bg-blue-800 shadow-md shadow-blue-700/20 transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Scholarship?</h3>
                        <p className="text-slate-500 mb-6">
                            Are you sure you want to delete <span className="font-semibold text-slate-700">"{selectedScholarship?.title}"</span>? This action cannot be undone.
                        </p>

                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setDeleteModalOpen(false)} className="px-5 py-2.5 flex-1 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="px-5 py-2.5 flex-1 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 shadow-md shadow-red-500/20 transition-colors">
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}