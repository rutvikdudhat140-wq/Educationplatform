import { useState } from "react";

import { Button } from "@/components/ui/button";

export const STREAM_OPTIONS = [
    "Engineering",
    "Management",
    "Commerce & Banking",
    "Medical",
    "Sciences",
    "Hotel Management",
    "Information Technology",
    "Arts & Humanities",
    "Mass Communication",
    "Agriculture",
    "Design",
    "Law",
    "Pharmacy",
    "Dental",
    "Performing Arts",
    "Education",
];

export const LEVEL_OPTIONS = [
    "UG",
    "PG",
    "Diploma",
    "PhD",
    "Other",
];

export const EXAM_TYPE_OPTIONS = [
    "National Level",
    "State Level",
    "University Level",
    "Institute Level",
];

export default function ExamForm({
    initialValues,
    onSubmit,
    submitLabel,
}) {
    const [form, setForm] = useState(initialValues);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(form);
    };

    return (
        <div className="mx-auto max-w-4xl">
            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-xl border bg-white p-5 shadow-sm"
            >
                <div className="grid gap-5 md:grid-cols-2">

                    <label className="space-y-2 text-sm font-medium">
                        Stream
                        <select name="stream"value={form.stream} onChange={handleChange}className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                            required>
                            <option value="">Select stream</option>

                            {STREAM_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>

<label className="space-y-2 text-sm font-medium">
                        Exam Name *
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter exam name"
                            className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                            required
                        />
                    </label>

<label className="space-y-2 text-sm font-medium">
                        Short Name
                        <input
                            name="shortName"
                            value={form.shortName}
                            onChange={handleChange}
                            placeholder="Enter short name"
                            className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                        />
                    </label>

<label className="space-y-2 text-sm font-medium">
                        Conducting Body
                        <input
                            name="conductingBody"
                            value={form.conductingBody}
                            onChange={handleChange}
                            placeholder="Enter conducting body"
                            className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                        />
                    </label>

<label className="space-y-2 text-sm font-medium">
                        Level *
                        <select
                            name="level"
                            value={form.level}
                            onChange={handleChange}
                            className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                            required>

                            <option value="">Select level</option>

                            {LEVEL_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>

<label className="space-y-2 text-sm font-medium">
                        Exam Type
                        <select
                            name="examType"
                            value={form.examType}
                            onChange={handleChange}
                            className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                            required>
                            <option value="">Select exam type</option>

                            {EXAM_TYPE_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="space-y-2 text-sm font-medium">
                        Status
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </label>

                </div>

                <label className="block space-y-2 text-sm font-medium">
                    Description
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Enter exam description"
                        rows={5}
                        className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"/>
                </label>

                <div className="flex justify-end border-t pt-5">
                    <Button type="submit">
                        {submitLabel}
                    </Button>
                </div>
            </form>
        </div>
    );
}
