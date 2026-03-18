"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import type { InterviewItem } from '@/lib/types';
import { toast } from 'sonner';

interface OfferPageProps {
  searchParams: {
    candidateId?: string;
  };
}

export default function OfferPage({ searchParams }: OfferPageProps) {
  const [candidate, setCandidate] = useState<InterviewItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [offerForm, setOfferForm] = useState({
    position: '',
    department: '',
    directManager: '',
    mentor: '',
    level: '',
    basicSalary: '',
    performanceSalary: '',
    months: '12',
    startDate: '',
    startHour: '9',
  });

  useEffect(() => {
    const fetchCandidate = async () => {
      if (searchParams.candidateId) {
        try {
          const response = await api.get<InterviewItem[]>(`/api/interviews`);
          const candidateData = response.data.find(item => item.id === parseInt(searchParams.candidateId));
          if (candidateData) {
            setCandidate(candidateData);
            setOfferForm({
              position: candidateData.position || '',
              department: candidateData.department || '',
              directManager: '',
              mentor: '',
              level: '',
              basicSalary: '',
              performanceSalary: '',
              months: '12',
              startDate: '',
              startHour: '9',
            });
          } else {
            toast.error('未找到候选人信息');
          }
        } catch (error) {
          console.error(error);
          toast.error('获取候选人信息失败');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchCandidate();
  }, [searchParams.candidateId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // 这里可以添加发送offer的逻辑
    toast.success('Offer已发送');
    // 可以添加跳转到其他页面的逻辑
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">加载中...</div>;
  }

  if (!candidate) {
    return <div className="flex items-center justify-center h-screen">未找到候选人信息</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">发送Offer</CardTitle>
            <CardDescription>为候选人 {candidate.candidateName} 发送录用通知</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">岗位</Label>
                  <Input
                    id="position"
                    value={offerForm.position}
                    onChange={(e) => setOfferForm({ ...offerForm, position: e.target.value })}
                    placeholder="请输入岗位名称"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">部门</Label>
                  <Input
                    id="department"
                    value={offerForm.department}
                    onChange={(e) => setOfferForm({ ...offerForm, department: e.target.value })}
                    placeholder="请输入部门名称"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="directManager">直接主管</Label>
                  <Input
                    id="directManager"
                    value={offerForm.directManager}
                    onChange={(e) => setOfferForm({ ...offerForm, directManager: e.target.value })}
                    placeholder="请输入直接主管姓名"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mentor">入职导师</Label>
                  <Input
                    id="mentor"
                    value={offerForm.mentor}
                    onChange={(e) => setOfferForm({ ...offerForm, mentor: e.target.value })}
                    placeholder="请输入入职导师姓名"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">职级</Label>
                  <Input
                    id="level"
                    value={offerForm.level}
                    onChange={(e) => setOfferForm({ ...offerForm, level: e.target.value })}
                    placeholder="请输入职级"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">薪资说明</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="basicSalary">基本工资 (元)</Label>
                        <Input
                          id="basicSalary"
                          type="number"
                          value={offerForm.basicSalary}
                          onChange={(e) => setOfferForm({ ...offerForm, basicSalary: e.target.value })}
                          placeholder="请输入基本工资"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="performanceSalary">绩效工资 (元)</Label>
                        <Input
                          id="performanceSalary"
                          type="number"
                          value={offerForm.performanceSalary}
                          onChange={(e) => setOfferForm({ ...offerForm, performanceSalary: e.target.value })}
                          placeholder="请输入绩效工资"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="months">年薪月数</Label>
                        <Input
                          id="months"
                          type="text"
                          value={offerForm.months}
                          onChange={(e) => setOfferForm({ ...offerForm, months: e.target.value })}
                          placeholder="请输入年薪月数，例如：12"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">报到事宜</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">报到日期</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={offerForm.startDate}
                          onChange={(e) => setOfferForm({ ...offerForm, startDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startHour">报到时间</Label>
                        <Input
                          id="startHour"
                          type="number"
                          min="8"
                          max="10"
                          value={offerForm.startHour}
                          onChange={(e) => setOfferForm({ ...offerForm, startHour: e.target.value })}
                          placeholder="请输入报到时间（小时）"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">OFFER LETTER 预览</CardTitle>
                  </CardHeader>
                  <CardContent className="font-serif">
                    <div className="space-y-4">
                      <h2 className="text-center text-xl font-bold">OFFER LETTER (录用通知书)</h2>
                      <p className="text-center">&nbsp;</p>
                      <p>尊敬的: {candidate.candidateName} 先生/女士</p>
                      <p className="text-center">&nbsp;</p>
                      <p>我们非常荣幸的通知您，您将被武汉风行在线技术有限公司聘用。具体事宜如下：</p>
                      <p className="font-bold">岗位情况：</p>
                      <p>您将就职于 {offerForm.department || '__________'} 的 {offerForm.position || '__________'} 职位。</p>
                      <p>您的直接主管是 {offerForm.directManager || '__________'}，您的入职导师是 {offerForm.mentor || '__________'}，您的职级是 {offerForm.level || '__________'}。</p>
                      <p className="font-bold">薪资说明</p>
                      <p>您在本职位的税前月薪为：</p>
                      <p>基本工资 RMB {offerForm.basicSalary || '__________'} 元，绩效工资 RMB {offerForm.performanceSalary || '__________'} 元，{offerForm.months || '__________'} 薪，提成/奖金根据业务情况发放。</p>
                      <p>公司将根据国家的法律法规代扣代缴个人所得税。</p>
                      <p className="font-bold">报到事宜</p>
                      <p>报到时间及地点：</p>
                      <p>请您在 {offerForm.startDate ? new Date(offerForm.startDate).getFullYear() : '______'} 年 {offerForm.startDate ? new Date(offerForm.startDate).getMonth() + 1 : '____'} 月 {offerForm.startDate ? new Date(offerForm.startDate).getDate() : '____'} 日上午 {offerForm.startHour || '____'} 点 之前 到公司人力资源部报到。</p>
                      <p>地址：湖北省武汉市东湖新技术开发区金融港一路7号光谷智慧园17栋。</p>
                      <p>联系人：曹芷薇     联系方式：027-81707372     E-mail：caozw@fun.tv</p>
                      <p className="font-bold">报到所需证件</p>
                      <p>1、身份证、学生证复印件(非实习生及已经毕业的应届生不需要提供学生证)</p>
                      <p>2、应聘简历上提及的毕业证、学位证及学信网学位证明文件，及其他认为必要的证件原件及复印件</p>
                      <p>3、上家公司的离职证明原件（实习生不需提供）</p>
                      <p>4、如需新办理社保卡（新开户），请自行到社保就近银行办理。其他情况可咨询HR曹芷薇/康书维</p>
                      <p>5、户口本首页及本人页的复印件，有变更项目的还需提供变更页复印件（实习生可在毕业前提供）</p>
                      <p>6、工资卡为浦发银行，请自行到就近银行办理（如已有银行卡请在银行卡复印件上注明姓名、卡号、开户行名称）。</p>
                      <p className="font-bold">体检</p>
                      <p>公司会安排统一的入职体检，时间及地点：请您告知HR您选择的体检分院，请携带身份证按照预约时间到指定分院体检。体检不合格者将不予以录用。</p>
                      <p className="font-bold">特殊说明</p>
                      <p>如您在入职前被发现面试环节向公司有关人员行贿或承诺好处、提供虚假信息或简历造假、在其他公司任职期间出现严重违纪行为、涉嫌刑事犯罪、公开发表与我司核心价值观相悖言论、传播不实言论、打探公司内部员工隐私、威胁恐吓辱骂公司员工、推迟入职时间未达成一致、被告知企业HC临时关闭等情况，此 offer 将自动失效。</p>
                      <p className="font-bold">录用确认</p>
                      <p>请您在收到本《录用通知书》后，三个工作日内以电子邮件的形式回复是否认同并接受本《录用通知书》的全部条款。如果您有任何问题请及时与我们联系反馈。 未在有效时间内回复确认，视为放弃入职。</p>
                      <p>本录用通知书只是双方建立劳动关系的意向，不能作为建立劳动合同关系的凭证。公司与您之间劳动关系的建立以劳动合同的签订日期为准。</p>
                      <p className="font-bold">公司愿景：致力于成为领先的AI文娱生态平台</p>
                      <p className="font-bold">公司使命：让内容流动更简单</p>
                      <p className="font-bold">公司价值观：用心做事  诚心待人 虚心求变</p>
                      <p>&nbsp;</p>
                      <p>期待您加入风行大家庭！为了您的方便，请在入职时准备一个心怡的自用水杯哦^_^</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button type="submit" className="w-full">
                发送Offer
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
