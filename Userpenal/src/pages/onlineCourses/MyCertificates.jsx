import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { createApiUrl } from '@/lib/api';
import {
  Award,
  BadgeCheck,
  ChevronRight,
  Download,
  Home,
  Printer,
  RefreshCw,
  Search,
  CheckCircle2,
  ShieldCheck,
  Copy,
  Check,
  User,

} from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('userToken')}`,
});

const MyCertificates = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    fetch(createApiUrl('/certificates/my'), { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => setCertificates(data.data || []));
  }, []);

  const openCertificate = useMemo(() => {
    const requested = searchParams.get('certificate');
    if (!requested) return null;
    return certificates.find((certificate) => certificate._id === requested) || null;
  }, [certificates, searchParams]);

  const closeCertificate = () => {
    if (searchParams.has('certificate')) {
      searchParams.delete('certificate');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const openCertificateDialog = (certificate) => {
    setSearchParams({ certificate: certificate._id }, { replace: true });
  };

  const filtered = useMemo(() => {
    return certificates.filter((certificate) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        (certificate.courseCategory &&
          certificate.courseCategory.toLowerCase().includes(selectedCategory.toLowerCase())) ||
        (selectedCategory === 'Finance' && certificate.courseName.toLowerCase().includes('finance'));

      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        [
          certificate.courseName,
          certificate.certificateId,
          certificate.instructorName,
          certificate.courseCategory,
          certificate.studentName
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term));

      return matchesCategory && matchesSearch;
    });
  }, [certificates, search, selectedCategory]);

  const formatDate = (date) => {
    if (!date) return 'Date N/A';
    const parsed = new Date(date);
    return parsed.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };


  const handleDownloadImage = async (targetCert) => {
    const cert = targetCert || openCertificate;
    if (!cert) return;

    try {
      const studentName = cert.studentName || 'Student';
      const courseTitle = cert.courseName || 'Online Course';
      const certId = cert.certificateId || 'CERT-2026-000001';
      const issueDate = formatDate(cert.issuedAt || cert.completionDate);

      // Create high-res offscreen canvas (2200x1550)
      const canvas = document.createElement('canvas');
      canvas.width = 2200;
      canvas.height = 1550;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#FAFAFC';
      ctx.fillRect(40, 40, canvas.width - 80, canvas.height - 80);

      // Double Gold & Navy Border
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 10;
      ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

      ctx.strokeStyle = '#172554';
      ctx.lineWidth = 3;
      ctx.strokeRect(80, 80, canvas.width - 160, canvas.height - 160);

      // Header Text
      ctx.textAlign = 'center';
      ctx.fillStyle = '#1D4ED8';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('EDUPLATFORM ONLINE ACADEMY', canvas.width / 2, 220);

      ctx.fillStyle = '#172554';
      ctx.font = 'bold 64px Georgia, serif';
      ctx.fillText('CERTIFICATE OF ACHIEVEMENT', canvas.width / 2, 310);

      // Accent Divider Line
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 300, 350);
      ctx.lineTo(canvas.width / 2 + 300, 350);
      ctx.stroke();

      // Recipient Body
      ctx.fillStyle = '#64748B';
      ctx.font = 'italic 34px Georgia, serif';
      ctx.fillText('This official certificate is proudly presented to', canvas.width / 2, 450);

      ctx.fillStyle = '#172554';
      ctx.font = 'bold 72px Georgia, serif';
      ctx.fillText(studentName, canvas.width / 2, 570);

      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 400, 610);
      ctx.lineTo(canvas.width / 2 + 400, 610);
      ctx.stroke();

      // Description
      ctx.fillStyle = '#64748B';
      ctx.font = '30px sans-serif';
      ctx.fillText('for successfully fulfilling all curriculum requirements, video lectures, practical projects,', canvas.width / 2, 700);
      ctx.fillText('and final examination for the program:', canvas.width / 2, 745);

      // Course Name
      ctx.fillStyle = '#1E40AF';
      ctx.font = 'bold 54px sans-serif';
      ctx.fillText(courseTitle, canvas.width / 2, 850);

      // Metadata Box
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(150, 1000, 550, 350);
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.strokeRect(150, 1000, 550, 350);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#64748B';
      ctx.font = '24px sans-serif';
      ctx.fillText('Instructor:', 180, 1060);
      ctx.fillText('Issued Date:', 180, 1130);
      ctx.fillText('Certificate ID:', 180, 1200);
      ctx.fillText('Status:', 180, 1270);

      ctx.fillStyle = '#172554';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(cert.instructorName || 'CA Ritu Sen', 380, 1060);
      ctx.fillText(issueDate, 380, 1130);

      ctx.fillStyle = '#2563EB';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(certId, 380, 1200);

      ctx.fillStyle = '#16A34A';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('✓ Verified Valid', 380, 1270);

      // Official Gold Stamp
      ctx.textAlign = 'center';
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(1100, 1175, 110, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 8;
      ctx.stroke();

      ctx.fillStyle = '#172554';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('OFFICIAL SEAL', 1100, 1175);
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('EDUPLATFORM', 1100, 1210);

      // Signatures
      ctx.textAlign = 'center';
      ctx.fillStyle = '#172554';
      ctx.font = 'italic bold 36px Georgia, serif';
      ctx.fillText('Dr. Rajesh V. Sharma', 1700, 1100);
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(1500, 1120);
      ctx.lineTo(1900, 1120);
      ctx.stroke();
      ctx.fillStyle = '#172554';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('Director of Education', 1700, 1160);

      ctx.fillStyle = '#172554';
      ctx.font = 'italic bold 36px Georgia, serif';
      ctx.fillText('Prof. Anita Roy', 1700, 1280);
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(1500, 1300);
      ctx.lineTo(1900, 1300);
      ctx.stroke();
      ctx.fillStyle = '#172554';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('Head of Examinations', 1700, 1340);

      // Download Trigger
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${studentName.replace(/\s+/g, '_')}_${certId}_Certificate.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      window.print();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  /* Landscape Certificate Renderer */
  const renderCertificate = (certificate, { forPrint = false } = {}) => {
    const studentName = certificate.studentName || 'Student Name';
    const courseTitle = certificate.courseName || 'Online Certification Course';
    const certId = certificate.certificateId || 'CERT-2026-000001';
    const issueDate = formatDate(certificate.issuedAt || certificate.completionDate);

    return (
      <div
        id={forPrint ? 'printable-cert-frame' : `certificate-${certificate._id}`}
        className={`relative w-full overflow-hidden bg-[#0F172A] text-[#0F172A] shadow-2xl transition-all ${
          forPrint ? 'p-6 w-[1100px] h-[780px] bg-[#0F172A]' : 'p-3 sm:p-5 rounded-2xl border-4 border-[#172554]'
        }`}
      >
        <div className="relative w-full h-full bg-[#FAFAFC] rounded-xl p-6 sm:p-8 border-4 border-[#D4AF37] ring-2 ring-[#172554]">
          <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />

          <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-[#D4AF37] rounded-tl-sm pointer-events-none" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-[#D4AF37] rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-[#D4AF37] rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-[#D4AF37] rounded-br-sm pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between h-full space-y-6">

            <div className="text-center space-y-1">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-1 rounded-full bg-[#172554] text-white shadow-md ring-2 ring-[#D4AF37]/50 mb-1">
                <Award size={18} className="text-[#F59E0B]" />
                <span className="text-[10.5px] font-black uppercase tracking-[0.25em] text-[#FDE047]">
                  Official Academic Credential
                </span>
              </div>

              <h4 className="text-[11px] sm:text-[13px] font-black uppercase tracking-[0.3em] text-[#1D4ED8]">
                EduPlatform Online Academy
              </h4>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-[0.15em] text-[#172554] font-serif">
                Certificate of Achievement
              </h1>

              <div className="mx-auto h-0.5 w-48 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-1" />
            </div>

            <div className="text-center space-y-3 my-2">
              <p className="text-xs sm:text-sm text-[#64748B] italic font-medium">
                This official certificate is proudly presented to
              </p>

              <div>
                <h2 className="inline-block border-b-2 border-[#D4AF37] px-10 pb-1 text-2xl sm:text-4xl md:text-5xl font-black text-[#172554] font-serif tracking-wide capitalize">
                  {studentName}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl mx-auto leading-relaxed">
                for successfully fulfilling all curriculum requirements, video lectures, practical projects, and final examination for the program:
              </p>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-[#1E40AF] tracking-tight">
                  {courseTitle}
                </h3>
                {certificate.courseCategory && (
                  <span className="inline-block rounded-full bg-[#EFF6FF] border border-[#BFDBFE] px-3.5 py-0.5 text-[11px] font-extrabold text-[#1D4ED8]">
                    {certificate.courseCategory}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 border-t border-[#E2E8F0] pt-4 mt-2">
              <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] text-left text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#64748B] font-medium">Instructor:</span>
                  <span className="font-bold text-[#172554]">{certificate.instructorName || 'CA Ritu Sen'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B] font-medium">Issued Date:</span>
                  <span className="font-bold text-[#172554]">{issueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B] font-medium">Certificate ID:</span>
                  <span className="font-mono font-bold text-[#2563EB]">{certId}</span>
                </div>
                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-[#64748B] font-medium">Verification:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1 text-[10.5px]">
                    <CheckCircle2 size={12} /> Verified Valid
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center my-1 md:my-0">
                <div className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F59E0B] to-[#FCD34D] text-[#172554] shadow-lg ring-4 ring-[#D4AF37]/30">
                  <div className="flex flex-col items-center justify-center rounded-full border-2 border-dashed border-[#172554]/50 p-2 text-center">
                    <ShieldCheck size={26} className="text-[#172554]" />
                    <span className="text-[7.5px] font-black uppercase tracking-tighter text-[#172554]">OFFICIAL SEAL</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div>
                  <div className="font-serif text-sm italic font-bold text-[#172554] truncate">
                    Dr. Rajesh V. Sharma
                  </div>
                  <div className="h-0.5 w-full bg-[#CBD5E1] my-0.5" />
                  <p className="text-[9.5px] font-bold uppercase text-[#172554]">Director of Education</p>
                  <p className="text-[8.5px] text-[#64748B]">EduPlatform Board</p>
                </div>

                <div>
                  <div className="font-serif text-sm italic font-bold text-[#172554] truncate">
                    Prof. Anita Roy
                  </div>
                  <div className="h-0.5 w-full bg-[#CBD5E1] my-0.5" />
                  <p className="text-[9.5px] font-bold uppercase text-[#172554]">Head of Exams</p>
                  <p className="text-[8.5px] text-[#64748B]">Academic Controller</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/80 pb-20">
      {/* CSS Print Styles targeting print portal */}
      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }
          body > *:not(#print-cert-portal) {
            display: none !important;
          }
          #print-cert-portal {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: white !important;
            z-index: 999999 !important;
          }
        }
      `}</style>

      {/* Clean High-Contrast Executive Hero Banner */}
      <div className="bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#2563EB] text-white pt-24 pb-14 px-4 sm:px-6 shadow-md border-b border-blue-900/40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

          <div className="space-y-3 max-w-2xl">
            {/* Golden Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Official Academic Credential Vault</span>
            </div>

            {/* 100% Crisp White Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-xs">
              My Certificates &amp; Credentials
            </h1>

            <p className="text-sm font-medium text-blue-100/90 leading-relaxed max-w-xl">
              Cryptographically verified academic certificates issued upon successful completion of accredited university courses and online learning tracks.
            </p>
          </div>

          {/* High-Contrast Stat Cards */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3.5 rounded-2xl text-center shadow-xs">
              <span className="text-3xl font-black text-amber-400 block">{certificates.length}</span>
              <span className="text-[11px] font-extrabold text-white uppercase tracking-wider">Certificates Earned</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3.5 rounded-2xl text-center shadow-xs">
              <span className="text-3xl font-black text-emerald-400 block">100%</span>
              <span className="text-[11px] font-extrabold text-white uppercase tracking-wider">Verified Genuine</span>
            </div>
          </div>

        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6">
        {/* Search & Filter Floating Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by course, student, ID..."
                className="h-10 w-full pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-600 outline-none transition-all"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto custom-scrollbar">
              {['All', 'Finance', 'Management', 'Technology'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#172554] text-white shadow-sm ring-2 ring-[#172554]/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat} {cat === 'All' ? `(${certificates.length})` : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-[#172554]">No Certificates Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Complete online courses to earn your official verified credentials.
              </p>
            </div>
            <Button onClick={() => navigate('/online-courses')} className="bg-[#172554] hover:bg-blue-900 text-white rounded-xl font-bold text-xs">
              Browse Online Courses
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((certificate) => (
              <div
                key={certificate._id}
                className="group flex flex-col justify-between bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-500 transition-all duration-300"
              >
                {/* Certificate Card Header */}
                <div className="relative flex h-36 flex-col items-center justify-center bg-gradient-to-br from-[#172554] via-[#1E3A8A] to-[#2563EB] p-4 text-center text-white">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-[#F59E0B] shadow-inner mb-1.5">
                    <Award className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
                    Official Academic Credential
                  </span>
                  <h4 className="text-xs font-extrabold text-white/95 line-clamp-1 mt-0.5">
                    {certificate.courseName}
                  </h4>
                </div>

                {/* Certificate Card Details Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold flex items-center gap-1"><User className="w-3.5 h-3.5 text-blue-600" /> Student</span>
                      <span className="font-extrabold text-[#172554] capitalize">{certificate.studentName}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-[#172554] line-clamp-2 leading-snug">
                      {certificate.courseName}
                    </h3>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Issued Date:</span>
                      <span className="font-bold text-slate-800">{formatDate(certificate.issuedAt || certificate.completionDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Certificate ID:</span>
                      <span className="font-mono font-bold text-blue-600">{certificate.certificateId}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                      <span className="text-slate-400 font-medium">Verification:</span>
                      <span className="font-bold text-emerald-600 text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified Valid
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                      onClick={() => openCertificateDialog(certificate)}
                      className="bg-[#172554] hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow-xs gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5" /> View Full
                    </Button>

                    <Button
                      onClick={() => handleDownloadImage(certificate)}
                      variant="outline"
                      className="border-slate-200 hover:bg-blue-50 text-slate-800 rounded-xl text-xs font-bold gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-600" /> Download
                    </Button>
                  </div>
                </div>
</div>
            ))}
          </div>
        )}
      </main>

      {/* Printable Certificate Offscreen Container */}
      <div id="print-cert-portal" className="fixed -left-[9999px] -top-[9999px] pointer-events-none">
        {openCertificate && renderCertificate(openCertificate, { forPrint: true })}
      </div>

      {/* Wide Landscape Certificate Modal Dialog */}
      <Dialog
        open={Boolean(openCertificate)}
        onOpenChange={(open) => !open && closeCertificate()}
      >
        <DialogContent className="w-full max-w-[95vw] sm:max-w-[1000px] md:max-w-[1050px] lg:max-w-[1120px] max-h-[95vh] overflow-y-auto p-4 sm:p-6 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#172554] flex items-center gap-2">
              <BadgeCheck className="text-blue-600" /> Official Verified Certificate
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              This certificate is digitally signed and cryptographically verified on EduPlatform.
            </DialogDescription>
          </DialogHeader>

          {openCertificate && (
            <div className="space-y-4 mt-2">
              {/* Landscape Certificate Component */}
              {renderCertificate(openCertificate)}

              {/* Modal Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Button
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs gap-1.5 shadow-md shadow-emerald-600/20"
                    onClick={() => handleDownloadImage(openCertificate)}
                  >
                    <Download size={15} />
                    Download Image / PDF
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-xl border-slate-300 text-[#172554] font-bold text-xs gap-1.5"
                    onClick={handlePrint}
                  >
                    <Printer size={15} />
                    Print Certificate
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-xl border-slate-300 text-[#172554] font-semibold text-xs gap-1.5"
                    onClick={() =>
                      navigate(
                        `/verify-certificate?id=${encodeURIComponent(
                          openCertificate.certificateId
                        )}`
                      )
                    }
                  >
                    <BadgeCheck size={15} className="text-blue-600" />
                    Verify Authenticity
                  </Button>
                </div>

                <Button
                  variant="outline"
                  className="rounded-xl border-slate-300 text-slate-600 font-semibold text-xs gap-1.5"
                  onClick={() => {
                    const url = `${window.location.origin}/verify-certificate?id=${encodeURIComponent(
                      openCertificate.certificateId
                    )}`;

                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(url);
                      setCopiedId(true);
                      setTimeout(() => setCopiedId(false), 2000);
                    } else {
                      window.open(url, '_blank', 'noopener');
                    }
                  }}
                >
                  {copiedId ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  {copiedId ? 'Link Copied!' : 'Copy Share Link'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyCertificates;
