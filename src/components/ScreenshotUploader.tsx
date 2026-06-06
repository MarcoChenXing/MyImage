"use client";

export function ScreenshotUploader({ onLoaded }: { onLoaded: (dataUrl: string) => void }) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center shadow-sm transition hover:border-blue-400 hover:bg-blue-50">
      <span className="text-lg font-semibold text-slate-900">上传交易截图</span>
      <span className="mt-2 text-sm text-slate-500">选择 PNG/JPG 后会进入 mock OCR 识别确认流程</span>
      <input
        className="hidden"
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => onLoaded(String(reader.result));
          reader.readAsDataURL(file);
        }}
      />
    </label>
  );
}
