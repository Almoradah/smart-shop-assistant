import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { CardSkeleton } from '@/components/shared/SkeletonLoader';
import { useAISettings, useUpdateAISettings } from '@/hooks/useDataHooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import {
  Save,
  RotateCcw,
  Settings,
  Cpu,
  Thermometer,
  Hash,
  FileText,
  MessageSquare,
  Target,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const modelOptions = [
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', description: 'Most capable, best for complex tasks' },
  { value: 'gpt-4', label: 'GPT-4', description: 'High quality, slower response' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', description: 'Fast and cost-effective' },
  { value: 'claude-3-opus', label: 'Claude 3 Opus', description: 'Anthropic\'s most powerful model' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet', description: 'Balanced performance' },
];

export default function AISettingsPage() {
  const { data: settings, isLoading } = useAISettings();
  const updateSettings = useUpdateAISettings();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    model: '',
    temperature: 0.7,
    maxTokens: 1024,
    promptTemplate: '',
    fallbackResponse: '',
    confidenceThreshold: 0.6,
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        model: settings.model,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        promptTemplate: settings.promptTemplate,
        fallbackResponse: settings.fallbackResponse,
        confidenceThreshold: settings.confidenceThreshold,
      });
    }
  }, [settings]);

  useEffect(() => {
    if (settings) {
      const changed = 
        formData.model !== settings.model ||
        formData.temperature !== settings.temperature ||
        formData.maxTokens !== settings.maxTokens ||
        formData.promptTemplate !== settings.promptTemplate ||
        formData.fallbackResponse !== settings.fallbackResponse ||
        formData.confidenceThreshold !== settings.confidenceThreshold;
      setHasChanges(changed);
    }
  }, [formData, settings]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(formData);
      toast({
        title: 'Settings saved',
        description: 'AI configuration has been updated.',
      });
      setHasChanges(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings.',
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    if (settings) {
      setFormData({
        model: settings.model,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        promptTemplate: settings.promptTemplate,
        fallbackResponse: settings.fallbackResponse,
        confidenceThreshold: settings.confidenceThreshold,
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageHeader title="AI Settings" description="Configure your AI assistant" />
        <div className="grid gap-6 lg:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="AI Settings"
        description="Configure your RAG assistant behavior"
        actions={
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleReset}
              disabled={!hasChanges}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!hasChanges || updateSettings.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Model Configuration */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Model Configuration</h3>
              <p className="text-sm text-muted-foreground">Select AI model and parameters</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select 
                value={formData.model} 
                onValueChange={(value) => setFormData({ ...formData, model: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                  Temperature
                </Label>
                <span className="text-sm font-medium text-foreground">{formData.temperature}</span>
              </div>
              <Slider
                value={[formData.temperature]}
                onValueChange={([value]) => setFormData({ ...formData, temperature: value })}
                min={0}
                max={2}
                step={0.1}
              />
              <p className="text-xs text-muted-foreground">
                Lower values make responses more focused, higher values more creative.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxTokens" className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                Max Tokens
              </Label>
              <Input
                id="maxTokens"
                type="number"
                value={formData.maxTokens}
                onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) || 0 })}
                min={100}
                max={4096}
              />
              <p className="text-xs text-muted-foreground">
                Maximum length of AI responses (100-4096).
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  Confidence Threshold
                </Label>
                <span className="text-sm font-medium text-foreground">
                  {(formData.confidenceThreshold * 100).toFixed(0)}%
                </span>
              </div>
              <Slider
                value={[formData.confidenceThreshold * 100]}
                onValueChange={([value]) => setFormData({ ...formData, confidenceThreshold: value / 100 })}
                min={0}
                max={100}
                step={5}
              />
              <p className="text-xs text-muted-foreground">
                Below this threshold, the fallback response will be used.
              </p>
            </div>
          </div>
        </div>

        {/* Prompt Templates */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Prompt Templates</h3>
              <p className="text-sm text-muted-foreground">Customize AI behavior and responses</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="promptTemplate">System Prompt Template</Label>
              <Textarea
                id="promptTemplate"
                value={formData.promptTemplate}
                onChange={(e) => setFormData({ ...formData, promptTemplate: e.target.value })}
                rows={8}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Use {'{context}'} for retrieved chunks and {'{question}'} for user input.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fallbackResponse" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                Fallback Response
              </Label>
              <Textarea
                id="fallbackResponse"
                value={formData.fallbackResponse}
                onChange={(e) => setFormData({ ...formData, fallbackResponse: e.target.value })}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Used when confidence score is below threshold.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
