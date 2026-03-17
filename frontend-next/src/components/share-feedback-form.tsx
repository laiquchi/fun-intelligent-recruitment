"use client";

import { useEffect, useState } from "react";
import { CircleAlert, CircleCheckBig, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { ShareInterviewInfo } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ShareFeedbackFormProps {
  shareId: string;
}

export function ShareFeedbackForm(props: ShareFeedbackFormProps) {
  const { shareId } = props;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [interview, setInterview] = useState<ShareInterviewInfo | null>(null);
  const [feedback, setFeedback] = useState("");
  const [productSense, setProductSense] = useState(0);
  const [systemDesign, setSystemDesign] = useState(0);
  const [agentAbility, setAgentAbility] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [ownership, setOwnership] = useState(0);
  const [learningSpeed, setLearningSpeed] = useState(0);

  useEffect(() => {
    const loadInterview = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get<{ success: boolean; interview: ShareInterviewInfo }>(
          `/api/interviews/share/${shareId}`
        );
        setInterview(response.data.interview);
      } catch (err) {
        const message = (err as { response?: { data?: { error?: string } } }).response?.data?.error;
        setError(message || "无法获取分享信息");
      } finally {
        setLoading(false);
      }
    };

    void loadInterview();
  }, [shareId]);

  const submit = async () => {
    if (!feedback.trim()) {
      toast.warning("请先填写反馈内容");
      return;
    }
    try {
      setSubmitting(true);
      await api.post(`/api/interviews/share/${shareId}/feedback`, {
        feedback,
        productSense,
        systemDesign,
        agentAbility,
        communication,
        ownership,
        learningSpeed
      });
      setSubmitted(true);
      toast.success("反馈提交成功");
    } catch (err) {
      const message = (err as { response?: { data?: { error?: string } } }).response?.data?.error;
      toast.error(message || "反馈提交失败");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <Card className="w-full max-w-xl">
          <CardContent className="flex h-48 items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-cyan-600" />
            <span>加载中...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <Card className="w-full max-w-xl">
          <CardContent className="space-y-4 py-12 text-center">
            <CircleAlert className="mx-auto h-12 w-12 text-red-500" />
            <p className="text-lg font-semibold">链接无效</p>
            <p className="text-sm text-slate-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <Card className="w-full max-w-xl">
          <CardContent className="space-y-4 py-12 text-center">
            <CircleCheckBig className="mx-auto h-12 w-12 text-emerald-500" />
            <p className="text-lg font-semibold">反馈已提交</p>
            <p className="text-sm text-slate-500">感谢你的反馈。</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_15%_10%,rgba(14,165,233,0.18),transparent_35%),linear-gradient(180deg,#f8fbfd_0%,#eef5fb_100%)] px-4 py-8">
      <Card className="w-full max-w-2xl border-cyan-200/70 bg-white/90 shadow-2xl shadow-cyan-900/10 backdrop-blur">
        <CardHeader>
          <CardTitle>填写面试反馈</CardTitle>
          <CardDescription>请在提交前确认反馈内容完整准确</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-3">
            <Info label="岗位" value={interview?.position || "-"} />
            <Info label="候选人" value={interview?.candidateName || "-"} />
            <Info label="时间" value={interview?.interviewTime || "-"} />
          </div>

          <div className="space-y-4">
            <Label>评价维度打分</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">1、产品感和结果品味（1-20分）</label>
                  <p className="text-xs text-slate-500">能精准定义核心问题，清晰判断价值与目标，不盲目纠结实现细节。</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={productSense || ''}
                    onChange={(event) => setProductSense(Math.max(1, Math.min(20, parseInt(event.target.value) || 1)))} 
                    className="w-20 rounded-md border border-slate-300 px-3 py-2 text-center text-sm"
                  />
                  <span className="ml-2 text-sm text-slate-500">分</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">2、系统与架构判断力（1-20分）</label>
                  <p className="text-xs text-slate-500">能评估方案的可行性、长期健康性与演进空间，兼顾落地成本与维护性。</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={systemDesign || ''}
                    onChange={(event) => setSystemDesign(Math.max(1, Math.min(20, parseInt(event.target.value) || 1)))} 
                    className="w-20 rounded-md border border-slate-300 px-3 py-2 text-center text-sm"
                  />
                  <span className="ml-2 text-sm text-slate-500">分</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">3、Agent 杠杆能力（1-20分）</label>
                  <p className="text-xs text-slate-500">善用AI拆解任务、引导输出并快速纠偏，能评估结果并优化。</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={agentAbility || ''}
                    onChange={(event) => setAgentAbility(Math.max(1, Math.min(20, parseInt(event.target.value) || 1)))} 
                    className="w-20 rounded-md border border-slate-300 px-3 py-2 text-center text-sm"
                  />
                  <span className="ml-2 text-sm text-slate-500">分</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">4、沟通与协作（1-15分）</label>
                  <p className="text-xs text-slate-500">能高效对齐目标与方案，推动跨团队共识，清晰传递需求并协同落地。</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={communication || ''}
                    onChange={(event) => setCommunication(Math.max(1, Math.min(15, parseInt(event.target.value) || 1)))} 
                    className="w-20 rounded-md border border-slate-300 px-3 py-2 text-center text-sm"
                  />
                  <span className="ml-2 text-sm text-slate-500">分</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">5、主人翁精神（1-15分）</label>
                  <p className="text-xs text-slate-500">端到端负责，主动发现并解决问题，跟进闭环交付与全生命周期质量。</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={ownership || ''}
                    onChange={(event) => setOwnership(Math.max(1, Math.min(15, parseInt(event.target.value) || 1)))} 
                    className="w-20 rounded-md border border-slate-300 px-3 py-2 text-center text-sm"
                  />
                  <span className="ml-2 text-sm text-slate-500">分</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">6、学习速度和实验心态（1-15分）</label>
                  <p className="text-xs text-slate-500">快速跟进技术/行业动态，敢于尝试、及时迭代，不墨守成规。</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={learningSpeed || ''}
                    onChange={(event) => setLearningSpeed(Math.max(1, Math.min(15, parseInt(event.target.value) || 1)))} 
                    className="w-20 rounded-md border border-slate-300 px-3 py-2 text-center text-sm"
                  />
                  <span className="ml-2 text-sm text-slate-500">分</span>
                </div>
              </div>
              <div className="flex items-center justify-between font-semibold border-t pt-3">
                <label>总分</label>
                <span>{productSense + systemDesign + agentAbility + communication + ownership + learningSpeed}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>反馈内容</Label>
            <Textarea
              rows={6}
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              placeholder="请输入候选人表现、岗位匹配度、建议等"
            />
          </div>

          <Button onClick={() => void submit()} disabled={submitting} className="w-full">
            {submitting && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            提交反馈
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Info(props: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{props.label}</p>
      <p className="mt-1 text-sm font-medium text-slate-800">{props.value}</p>
    </div>
  );
}

