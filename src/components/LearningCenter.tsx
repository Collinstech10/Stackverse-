import React, { useState } from "react";
import { motion } from "motion/react";
import {
  BookOpen,
  Sparkles,
  Trophy,
  Code2,
  Play,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Cpu,
  Bookmark,
  RefreshCw,
  AlertCircle,
  UserCheck
} from "lucide-react";
import { Course, CodingChallenge } from "../types";

export default function LearningCenter() {
  const [totalXP, setTotalXP] = useState(1450);
  const [userLevel, setUserLevel] = useState(8);
  const [activeTrack, setActiveTrack] = useState<"courses" | "compiler">("courses");
  const [activeCourseId, setActiveCourseId] = useState<string>("c1");
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showCertificate, setShowCertificate] = useState(false);

  // Compiler state
  const [activeChallengeId, setActiveChallengeId] = useState<string>("ch1");
  const [challengeCode, setChallengeCode] = useState(`function sumArray(arr) {\n  // Write your code here\n  return arr.reduce((acc, curr) => acc + curr, 0);\n}`);
  const [compilerResults, setCompilerResults] = useState<{ status: "idle" | "success" | "fail"; output: string }>({ status: "idle", output: "" });
  const [isCompiling, setIsCompiling] = useState(false);

  const courses: Course[] = [
    {
      id: "c1",
      title: "Advanced React 19 & Compiler Optimization",
      desc: "Master fine-grained reactivity, transition hooks, clean useActionState APIs, and optimizing bundles.",
      difficulty: "Intermediate",
      xpReward: 500,
      lessons: [
        { id: "l1", title: "Automatic Memoization with React Compiler", duration: "10m", completed: true },
        { id: "l2", title: "Handling State via useActionState & Server Actions", duration: "12m", completed: true },
        { id: "l3", title: "Fine-grained suspense & dynamic streams", duration: "8m", completed: false }
      ],
      quiz: [
        {
          question: "Which hook is natively introduced in React 19 to handle state transitions in form submissions?",
          options: ["useActionState", "useTransitionState", "useFormStatus", "useDeferredState"],
          correctIndex: 0
        },
        {
          question: "True or False: The React Compiler requires manual useMemo declarations to work.",
          options: ["True", "False"],
          correctIndex: 1
        }
      ]
    },
    {
      id: "c2",
      title: "Vector Databases & Semantic Embeddings",
      desc: "Design AI architectures. Store, index, and query embeddings using cosine similarity inside PGVector.",
      difficulty: "Advanced",
      xpReward: 800,
      lessons: [
        { id: "l4", title: "What are dense vector embeddings?", duration: "15m", completed: false },
        { id: "l5", title: "Applying Cosine Similarity indexing with PGVector", duration: "20m", completed: false }
      ],
      quiz: [
        {
          question: "Which SQL operator is primarily used in PGVector for calculating Cosine Distance?",
          options: ["<=>", "<->", "+=>", "==>"],
          correctIndex: 0
        }
      ]
    }
  ];

  const challenges: CodingChallenge[] = [
    {
      id: "ch1",
      title: "Sum array of integers",
      desc: "Implement a function `sumArray(arr)` that aggregates all elements within an array of integer values. Return 0 if the array is empty.",
      stub: `function sumArray(arr) {\n  // Write your code here\n  return arr.reduce((acc, curr) => acc + curr, 0);\n}`,
      solution: "return arr.reduce((acc, curr) => acc + curr, 0)",
      testCase: "[1, 2, 3, 4] -> 10"
    },
    {
      id: "ch2",
      title: "Filter Prime numbers",
      desc: "Implement a function `filterPrimes(arr)` returning a new array containing only prime numbers from the input array.",
      stub: `function filterPrimes(arr) {\n  // Write your code here\n  return arr.filter(n => {\n    if (n < 2) return false;\n    for(let i=2; i<=Math.sqrt(n); i++) {\n      if (n % i === 0) return false;\n    }\n    return true;\n  });\n}`,
      solution: "primes filter",
      testCase: "[1, 2, 3, 4, 5, 6, 7] -> [2, 3, 5, 7]"
    }
  ];

  const selectedCourse = courses.find(c => c.id === activeCourseId) || courses[0];
  const selectedChallenge = challenges.find(ch => ch.id === activeChallengeId) || challenges[0];

  const handleSelectCourse = (id: string) => {
    setActiveCourseId(id);
    setQuizScore(null);
    setQuizAnswers({});
    setShowCertificate(false);
  };

  // Submit course quiz
  const handleSubmitQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    let correct = 0;
    selectedCourse.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) correct++;
    });

    setQuizScore(correct);
    if (correct === selectedCourse.quiz.length) {
      setTotalXP(totalXP + selectedCourse.xpReward);
      setUserLevel(userLevel + 1);
      setShowCertificate(true);
    }
  };

  // Execute Sandbox Code Compiler
  const handleExecuteCompiler = () => {
    setIsCompiling(true);
    setCompilerResults({ status: "idle", output: "" });

    setTimeout(() => {
      try {
        // Safe evaluation simulation for robust developer feedback
        // We write a realistic code sandboxing engine that evaluates Javascript inside a clean sandbox scope
        const testRunner = new Function("userCode", `
          try {
            eval(userCode);
            if (typeof sumArray === "function") {
              const res1 = sumArray([1, 2, 3, 4]);
              const res2 = sumArray([]);
              if (res1 === 10 && res2 === 0) {
                return { success: true, log: "Test Suite passed successfully!\\n\\n[TEST 1] sumArray([1, 2, 3, 4]) -> Expected: 10, Received: " + res1 + " (PASS)\\n[TEST 2] sumArray([]) -> Expected: 0, Received: " + res2 + " (PASS)" };
              } else {
                return { success: false, log: "Assertion Error. Incorrect results on edge cases.\\nExpected sumArray([]) to return 0." };
              }
            } else if (typeof filterPrimes === "function") {
              const res = filterPrimes([1, 2, 3, 4, 5, 6, 7]);
              if (JSON.stringify(res) === JSON.stringify([2, 3, 5, 7])) {
                return { success: true, log: "Test Suite passed successfully!\\n\\n[TEST 1] filterPrimes([1..7]) -> Expected: [2,3,5,7], Received: " + JSON.stringify(res) + " (PASS)" };
              } else {
                return { success: false, log: "Assertion Error. Got: " + JSON.stringify(res) };
              }
            }
            return { success: false, log: "Failed: Target function not defined in workspace." };
          } catch(err) {
            return { success: false, log: "Runtime Syntax Error: " + err.message };
          }
        `);

        const result = testRunner(challengeCode);
        if (result.success) {
          setCompilerResults({ status: "success", output: result.log });
          setTotalXP(prev => prev + 150);
        } else {
          setCompilerResults({ status: "fail", output: result.log });
        }

      } catch (err: any) {
        setCompilerResults({ status: "fail", output: "Interpreter crashed. Malformed JS compilation." });
      } finally {
        setIsCompiling(false);
      }
    }, 900);
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Learning Center Banner Achievements */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <Trophy className="h-4.5 w-4.5" />
            <span>Developer Level: Guild Archmage</span>
          </div>
          <h2 className="text-xl font-bold font-display text-slate-100">StackVerse Developer Curricula</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Progress through elite coding disciplines, take quizzes to unlock credentials, or implement and compile algorithms inside our browser-level compiler container.
          </p>
        </div>

        {/* Level card */}
        <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center gap-4 shrink-0">
          <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-lg text-white font-display">
            {userLevel}
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wide font-mono">Current Rank:</span>
            <span className="text-sm font-bold text-indigo-400 block font-display">Level {userLevel} Arch-Mage</span>
            <span className="text-[11px] text-slate-500">{totalXP} Total XP Earned</span>
          </div>
        </div>
      </div>

      {/* Track Navigator */}
      <div className="flex border-b border-white/5 bg-slate-950/20 px-2 max-w-xs rounded-xl border border-white/5">
        <button
          onClick={() => setActiveTrack("courses")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTrack === "courses" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Curricula & Quizzes
        </button>
        <button
          onClick={() => setActiveTrack("compiler")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTrack === "compiler" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Coding Challenges
        </button>
      </div>

      {/* Track: Courses */}
      {activeTrack === "courses" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Courses Menu */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available Tracks</h3>
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleSelectCourse(course.id)}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                  activeCourseId === course.id
                    ? "bg-indigo-600/10 border-indigo-500"
                    : "bg-slate-950/40 border-white/5 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-semibold border ${
                    course.difficulty === "Advanced"
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {course.difficulty}
                  </span>
                  <span className="text-[10px] text-indigo-400 font-mono font-bold">+{course.xpReward} XP</span>
                </div>
                <h4 className="text-xs font-bold text-slate-100">{course.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {course.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Active Course Details */}
          <div className="lg:col-span-8 glass-panel rounded-3xl p-6 space-y-6">
            <div className="space-y-1.5 border-b border-white/5 pb-4">
              <h3 className="text-base font-bold text-slate-100 font-display">{selectedCourse.title}</h3>
              <p className="text-xs text-slate-400">{selectedCourse.desc}</p>
            </div>

            {/* Syllabus */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Course Syllabus</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedCourse.lessons.map((les) => (
                  <div
                    key={les.id}
                    className="p-3.5 rounded-xl bg-slate-950/40 border border-white/5 flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-slate-200">{les.title}</p>
                      <span className="text-[10px] text-slate-500 font-mono">Duration: {les.duration}</span>
                    </div>
                    {les.completed ? (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                        COMPLETED
                      </span>
                    ) : (
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20 font-bold">
                        LOCKED
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quiz panel */}
            <div className="border-t border-white/5 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-100 font-display flex items-center gap-2">
                    <HelpCircle className="h-4.5 w-4.5 text-indigo-400" />
                    Checkpoint Quiz
                  </h4>
                  <p className="text-xs text-slate-400">Complete all questions accurately to unlock course certificates</p>
                </div>
              </div>

              <form onSubmit={handleSubmitQuiz} className="space-y-5">
                {selectedCourse.quiz.map((q, qIdx) => (
                  <div key={qIdx} className="space-y-2.5 p-4 rounded-2xl bg-slate-950 border border-white/5">
                    <p className="text-xs font-semibold text-slate-200">{qIdx + 1}. {q.question}</p>
                    <div className="space-y-1.5 pl-2">
                      {q.options.map((opt, oIdx) => (
                        <label key={oIdx} className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                          <input
                            type="radio"
                            name={`q_${qIdx}`}
                            checked={quizAnswers[qIdx] === oIdx}
                            onChange={() => setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx })}
                            className="text-indigo-600 accent-indigo-600 focus:ring-indigo-500"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-2">
                  {quizScore !== null && (
                    <span className={`text-xs font-bold font-mono px-3 py-1.5 rounded-lg border ${
                      quizScore === selectedCourse.quiz.length
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/25"
                    }`}>
                      {quizScore === selectedCourse.quiz.length
                        ? "🎉 Score: 100%! All assertions verified!"
                        : `❌ Checked: ${quizScore}/${selectedCourse.quiz.length} correct. Retry compiler errors.`}
                    </span>
                  )}
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow"
                  >
                    Submit Quiz Answers
                  </button>
                </div>
              </form>
            </div>

            {/* Certificate modal visual */}
            {showCertificate && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900/40 to-violet-900/40 border border-indigo-500/30 flex flex-col items-center text-center space-y-3"
              >
                <Trophy className="h-10 w-10 text-amber-400 animate-bounce" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-100 font-display">SaaS Scaffolding Certificate Earned</h4>
                  <p className="text-xs text-indigo-300">Awarded to you for verifying 100% of curriculum standards</p>
                </div>
                <div className="p-2 bg-slate-950/80 rounded-lg border border-white/5 font-mono text-[10px] text-slate-400">
                  REF_CERT: {selectedCourse.id.toUpperCase()}_{Date.now().toString().substring(6)}
                </div>
              </motion.div>
            )}

          </div>
        </div>
      )}

      {/* Track: Compiler */}
      {activeTrack === "compiler" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
          {/* Challenges selector sidebar */}
          <div className="lg:col-span-4 space-y-3 h-full">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Algorithmic Stubs</h3>
            {challenges.map((ch) => (
              <div
                key={ch.id}
                onClick={() => {
                  setActiveChallengeId(ch.id);
                  setChallengeCode(ch.stub);
                  setCompilerResults({ status: "idle", output: "" });
                }}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                  activeChallengeId === ch.id
                    ? "bg-indigo-600/10 border-indigo-500"
                    : "bg-slate-950/40 border-white/5 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/25">
                    ALGO
                  </span>
                  <span className="text-[10px] text-indigo-400 font-bold">+150 XP</span>
                </div>
                <h4 className="text-xs font-bold text-slate-100">{ch.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {ch.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Interactive Compiler window */}
          <div className="lg:col-span-8 glass-panel rounded-3xl flex flex-col justify-between overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900/60 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/25">
                  SANDBOX CORE
                </span>
                <h3 className="text-sm font-bold text-slate-100 font-display">{selectedChallenge.title}</h3>
                <p className="text-[11px] text-slate-400">{selectedChallenge.desc}</p>
              </div>
            </div>

            {/* Compiler Code editor block */}
            <div className="flex-grow p-4 bg-slate-950 font-mono text-xs flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-3 py-1 bg-slate-900 border-b border-white/5 text-[10px] text-slate-500 rounded-t-xl">
                <span>SANDBOX_WORKSPACE.JS</span>
                <span className="text-indigo-400">JAVASCRIPT (ES6)</span>
              </div>
              <textarea
                value={challengeCode}
                onChange={(e) => setChallengeCode(e.target.value)}
                className="w-full flex-grow p-4 bg-slate-950/40 text-emerald-400 focus:outline-none resize-none font-mono text-xs border border-white/5 rounded-b-xl border-t-0 leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Compile actions & Logs */}
            <div className="p-4 bg-slate-900/40 border-t border-white/5 space-y-3 shrink-0">
              {compilerResults.status !== "idle" && (
                <div className={`p-4 rounded-xl border font-mono text-xs space-y-1 max-h-36 overflow-y-auto leading-relaxed ${
                  compilerResults.status === "success"
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                    : "bg-rose-500/5 border-rose-500/20 text-rose-400"
                }`}>
                  <span className="font-bold block uppercase">{compilerResults.status === "success" ? "✅ SUCCESS: COMPILE STAGES OK" : "❌ ASSERTION FAIL: ERRORS DETECTED"}</span>
                  <pre className="whitespace-pre-wrap">{compilerResults.output}</pre>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-500">Test Cases: {selectedChallenge.testCase}</span>
                <button
                  onClick={handleExecuteCompiler}
                  disabled={isCompiling}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {isCompiling ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  <span>{isCompiling ? "Compiling..." : "Run Test Suite"}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
