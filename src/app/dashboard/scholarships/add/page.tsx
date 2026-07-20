"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    Save, 
    ArrowLeft, 
    BookOpen, 
    Globe, 
    DollarSign, 
    Calendar, 
    CheckSquare, 
    FileText 
} from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/app/lib/auth-client";

interface FormDataState {
    title: string;
    slug: string;
    image: string;
    universityName: string;
    country: string;
    city: string;
    degree: string;
    subject: string;
    fundingType: string;
    funding: {
        tuitionCoverage: string;
        accommodation: boolean;
        monthlyStipend: string | number;
        travelAllowance: boolean;
        healthInsurance: boolean;
        visaSupport: boolean;
        otherBenefits: string;
    };
    applicationOpen: string;
    applicationDeadline: string;
    intake: string;
    shortDescription: string;
    overview: string;
    eligibility: {
        minimumCGPA: string | number;
        minimumIELTS: string | number;
        minimumTOEFL: string | number;
        ageLimit: string | number;
        nationality: string;
        acceptedDegrees: string;
        workExperience: string;
        languageRequirement: string;
    };
    requiredDocuments: string;
    applicationUrl: string;
    tags: string;
    isFeatured: boolean;
    isActive: boolean;
}

export default function AddScholarshipPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial Form State
    const [formData, setFormData] = useState<FormDataState>({
        title: "",
        slug: "",
        image: "",
        universityName: "",
        country: "",
        city: "",
        degree: "Bachelor",
        subject: "",
        fundingType: "Fully Funded",
        funding: {
            tuitionCoverage: "",
            accommodation: false,
            monthlyStipend: "", 
            travelAllowance: false,
            healthInsurance: false,
            visaSupport: false,
            otherBenefits: "",
        },
        applicationOpen: "",
        applicationDeadline: "",
        intake: "",
        shortDescription: "",
        overview: "",
        eligibility: {
            minimumCGPA: "",
            minimumIELTS: "",
            minimumTOEFL: "",
            ageLimit: "",
            nationality: "",
            acceptedDegrees: "",
            workExperience: "",
            languageRequirement: "",
        },
        requiredDocuments: "",
        applicationUrl: "",
        tags: "",
        isFeatured: true,
        isActive: true,
    });

    // Auto-generate a clean URL slug from the title
    useEffect(() => {
        const generatedSlug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
        setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }, [formData.title]);

    // Handlers for standard inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handlers for nested objects (funding, eligibility)
    const handleNestedChange = (category: "funding" | "eligibility", e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [name]: type === "checkbox" ? checked : type === "number" && value !== "" ? Number(value) : value,
            },
        }));
    };

    // Helper to convert comma-separated strings into clean arrays
    const toArray = (str: string) => str.split(",").map((s) => s.trim()).filter(Boolean);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Format the payload to match the MongoDB schema requirements
        const payload = {
            ...formData,
            subject: toArray(formData.subject),
            intake: toArray(formData.intake),
            requiredDocuments: toArray(formData.requiredDocuments),
            tags: toArray(formData.tags),
            funding: {
                ...formData.funding,
                monthlyStipend: Number(formData.funding.monthlyStipend || 0),
                otherBenefits: toArray(formData.funding.otherBenefits)
            },
            eligibility: {
                ...formData.eligibility,
                minimumCGPA: Number(formData.eligibility.minimumCGPA || 0),
                minimumIELTS: Number(formData.eligibility.minimumIELTS || 0),
                minimumTOEFL: Number(formData.eligibility.minimumTOEFL || 0),
                ageLimit: Number(formData.eligibility.ageLimit || 0),
                nationality: toArray(formData.eligibility.nationality),
                acceptedDegrees: toArray(formData.eligibility.acceptedDegrees)
            }
        };

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const tokenResponse = await authClient.token();
            const token = tokenResponse?.data?.token;

            if (!token) {
                throw new Error("Authentication error: You are not logged in.");
            }

            const res = await fetch(`${apiUrl}/scholarships`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to create scholarship");
            }

            toast.success("Scholarship created successfully!");
            router.push("/dashboard/scholarships/view"); 
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message || "An unexpected error occurred. Please try again.");
                setError(err.message);
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button type="button" onClick={() => router.back()} className="flex items-center text-slate-500 hover:text-slate-900 mb-2 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </button>
                        <h1 className="text-3xl font-bold text-slate-900">Add New Scholarship</h1>
                        <p className="text-slate-500 mt-1">Fill in the details to publish a new scholarship opportunity.</p>
                    </div>
                    <button 
                        type="submit"
                        form="scholarship-form"
                        disabled={isLoading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        <Save className="w-5 h-5" />
                        {isLoading ? "Saving..." : "Save & Publish"}
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                        {error}
                    </div>
                )}

                <form id="scholarship-form" className="space-y-8" onSubmit={handleSubmit}>
                    
                    {/* SECTION 1: Basic Information */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-6 border-b pb-4">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-semibold text-slate-800">Basic Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Scholarship Title *</label>
                                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., MEXT Scholarship 2025" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Generated Slug</label>
                                <input disabled type="text" value={formData.slug} className="w-full p-2.5 border rounded-lg bg-slate-50 text-slate-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL *</label>
                                <input required type="url" name="image" value={formData.image} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">University Name *</label>
                                <input required type="text" name="universityName" value={formData.universityName} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Official Application URL *</label>
                                <input required type="url" name="applicationUrl" value={formData.applicationUrl} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: Location & Academic */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-6 border-b pb-4">
                            <Globe className="w-5 h-5 text-purple-600" />
                            <h2 className="text-xl font-semibold text-slate-800">Location & Academic</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Country *</label>
                                <input required type="text" name="country" value={formData.country} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                                <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Degree Level *</label>
                                <select required name="degree" value={formData.degree} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                    <option value="Bachelor">Bachelor</option>
                                    <option value="Master">Master</option>
                                    <option value="PhD">PhD</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subjects (Comma separated) *</label>
                                <input required type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Computer Science, Engineering, Business" />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: Funding Details */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-6 border-b pb-4">
                            <DollarSign className="w-5 h-5 text-emerald-600" />
                            <h2 className="text-xl font-semibold text-slate-800">Funding Details</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Funding Type *</label>
                                <select required name="fundingType" value={formData.fundingType} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                    <option value="Fully Funded">Fully Funded</option>
                                    <option value="Partial Funded">Partial Funded</option>
                                    <option value="Tuition Waiver">Tuition Waiver</option>
                                    <option value="Self Funded">Self Funded</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Stipend *</label>
                                <input required type="number" name="monthlyStipend" value={formData.funding.monthlyStipend} onChange={(e) => handleNestedChange("funding", e)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tuition Coverage Description *</label>
                                <input required type="text" name="tuitionCoverage" value={formData.funding.tuitionCoverage} onChange={(e) => handleNestedChange("funding", e)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., 100% Tuition fee waived for 4 years" />
                            </div>
                            
                            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                                <label className="flex items-center gap-2 text-sm text-slate-700">
                                    <input type="checkbox" name="accommodation" checked={formData.funding.accommodation} onChange={(e) => handleNestedChange("funding", e)} className="w-4 h-4 rounded border-slate-300" />
                                    Accommodation
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-700">
                                    <input type="checkbox" name="travelAllowance" checked={formData.funding.travelAllowance} onChange={(e) => handleNestedChange("funding", e)} className="w-4 h-4 rounded border-slate-300" />
                                    Travel Allowance
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-700">
                                    <input type="checkbox" name="healthInsurance" checked={formData.funding.healthInsurance} onChange={(e) => handleNestedChange("funding", e)} className="w-4 h-4 rounded border-slate-300" />
                                    Health Insurance
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-700">
                                    <input type="checkbox" name="visaSupport" checked={formData.funding.visaSupport} onChange={(e) => handleNestedChange("funding", e)} className="w-4 h-4 rounded border-slate-300" />
                                    Visa Support
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: Dates & Description */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-6 border-b pb-4">
                            <Calendar className="w-5 h-5 text-orange-600" />
                            <h2 className="text-xl font-semibold text-slate-800">Dates & Description</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Application Open Date *</label>
                                <input required type="date" name="applicationOpen" value={formData.applicationOpen} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Application Deadline *</label>
                                <input required type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Intakes (Comma separated) *</label>
                                <input required type="text" name="intake" value={formData.intake} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Fall 2027, Spring 2027" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Short Description *</label>
                                <textarea required name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={2} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Brief summary for the card..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Overview *</label>
                                <textarea required name="overview" value={formData.overview} onChange={handleChange} rows={5} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Detailed description of the scholarship..." />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 5: Eligibility */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-6 border-b pb-4">
                            <CheckSquare className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-xl font-semibold text-slate-800">Eligibility Criteria</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Min CGPA *</label>
                                <input required type="number" step="0.1" name="minimumCGPA" value={formData.eligibility.minimumCGPA} onChange={(e) => handleNestedChange("eligibility", e)} className="w-full p-2.5 border rounded-lg outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Min IELTS *</label>
                                <input required type="number" step="0.5" name="minimumIELTS" value={formData.eligibility.minimumIELTS} onChange={(e) => handleNestedChange("eligibility", e)} className="w-full p-2.5 border rounded-lg outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Min TOEFL *</label>
                                <input required type="number" name="minimumTOEFL" value={formData.eligibility.minimumTOEFL} onChange={(e) => handleNestedChange("eligibility", e)} className="w-full p-2.5 border rounded-lg outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Age Limit *</label>
                                <input required type="number" name="ageLimit" value={formData.eligibility.ageLimit} onChange={(e) => handleNestedChange("eligibility", e)} className="w-full p-2.5 border rounded-lg outline-none" />
                            </div>
                            
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Accepted Nationalities *</label>
                                <input required type="text" name="nationality" value={formData.eligibility.nationality} onChange={(e) => handleNestedChange("eligibility", e)} className="w-full p-2.5 border rounded-lg outline-none" placeholder="Bangladesh, India, International" />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Accepted Degrees *</label>
                                <input required type="text" name="acceptedDegrees" value={formData.eligibility.acceptedDegrees} onChange={(e) => handleNestedChange("eligibility", e)} className="w-full p-2.5 border rounded-lg outline-none" placeholder="BSc, BA, BEng" />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 6: Documents & Settings */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-6 border-b pb-4">
                            <FileText className="w-5 h-5 text-slate-600" />
                            <h2 className="text-xl font-semibold text-slate-800">Documents & SEO</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Required Documents *</label>
                                <textarea required name="requiredDocuments" value={formData.requiredDocuments} onChange={handleChange} rows={3} className="w-full p-2.5 border rounded-lg outline-none resize-none" placeholder="Passport, Transcript, CV, Recommendation Letter" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tags for SEO *</label>
                                <textarea required name="tags" value={formData.tags} onChange={handleChange} rows={3} className="w-full p-2.5 border rounded-lg outline-none resize-none" placeholder="AI, Engineering, Japan" />
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-6 mt-6 pt-6 border-t">
                            <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
                                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                Mark as Featured
                            </label>
                            <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
                                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                Active (Visible)
                            </label>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}