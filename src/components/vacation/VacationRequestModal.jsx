import { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import DateRangePicker from '../ui/DateRangePicker';

// ──────────────────────────────────────────────────────────────
// VacationRequestModal — модальная форма создания заявки на отпуск.
// Props: open, onClose, vacationBalance ({available, used, total})
// ──────────────────────────────────────────────────────────────

function calcDays(start, end) {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  if (e < s) return 0;
  return Math.round((e - s) / 86400000) + 1;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

const INITIAL = { type: 'labor', startDate: '', endDate: '', reason: '' };

export default function VacationRequestModal({ open, onClose, vacationBalance }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Reset on open/close
  useEffect(() => {
    if (open) {
      setForm(INITIAL);
      setErrors({});
      setSubmitted(false);
    }
  }, [open]);

  // Auto-close after success
  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(onClose, 2000);
    return () => clearTimeout(t);
  }, [submitted, onClose]);

  const days = useMemo(
    () => calcDays(form.startDate, form.endDate),
    [form.startDate, form.endDate]
  );

  const set = useCallback((key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }, []);

  const handleDateChange = useCallback((s, e) => {
    setForm((f) => ({ ...f, startDate: s, endDate: e }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.startDate;
      delete next.endDate;
      return next;
    });
  }, []);

  const validate = useCallback(() => {
    const errs = {};
    const today = todayStr();

    if (!form.startDate) {
      errs.startDate = 'Укажите дату начала';
    } else if (form.startDate < today) {
      errs.startDate = 'Дата начала не может быть в прошлом';
    }

    if (!form.endDate) {
      errs.endDate = 'Укажите дату окончания';
    } else if (form.startDate && form.endDate < form.startDate) {
      errs.endDate = 'Дата окончания должна быть позже начала';
    }

    if (form.type === 'labor' && days > 0 && days > vacationBalance.available) {
      errs.endDate = `Превышен остаток: ${days} дн. > ${vacationBalance.available} дн. доступных`;
    }

    if (form.type === 'social' && !form.reason.trim()) {
      errs.reason = 'Укажите причину для социального отпуска';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form, days, vacationBalance]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (validate()) setSubmitted(true);
    },
    [validate]
  );

  // Show 14-day warning for first vacation
  const showMinWarning = form.type === 'labor' && days > 0 && days < 14;

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in"
        style={{ animation: 'modalIn 200ms ease-out' }}
      >
        {/* Success state */}
        {submitted ? (
          <div className="p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-900">Заявка отправлена</p>
            <p className="text-sm text-gray-500 mt-1">Ожидает согласования руководителем</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-900">Заявка на отпуск</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1 min-h-0">
              {/* Vacation type */}
              <fieldset>
                <legend className="text-sm font-medium text-gray-700 mb-2">Тип отпуска</legend>
                <div className="flex gap-2">
                  {[
                    { value: 'labor', label: 'Трудовой' },
                    { value: 'social', label: 'Социальный' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium cursor-pointer transition-all ${
                        form.type === opt.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="vacationType"
                        value={opt.value}
                        checked={form.type === opt.value}
                        onChange={() => set('type', opt.value)}
                        className="sr-only"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Period — calendar range picker */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Период</label>
                  {days > 0 && (
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
                      {days} дн.
                    </span>
                  )}
                </div>
                <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-3">
                  <DateRangePicker
                    startDate={form.startDate}
                    endDate={form.endDate}
                    onChange={handleDateChange}
                    minDate={todayStr()}
                  />
                </div>
                {(errors.startDate || errors.endDate) && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.startDate || errors.endDate}</p>
                )}
              </div>

              {/* Balance info (labor only) */}
              {form.type === 'labor' && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600">
                      Остаток: <strong className="font-semibold text-gray-900">{vacationBalance.available} дн.</strong> из {vacationBalance.total}
                    </p>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(vacationBalance.used / vacationBalance.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 14-day warning */}
              {showMinWarning && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                  <p className="text-xs text-amber-700">
                    Первый отпуск за рабочий период должен быть не менее 14 календарных дней.
                  </p>
                </div>
              )}

              {/* Reason (social only) */}
              {form.type === 'social' && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Причина <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={form.reason}
                    onChange={(e) => set('reason', e.target.value)}
                    rows={3}
                    placeholder="Укажите причину социального отпуска..."
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm resize-none transition-colors ${
                      errors.reason
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                    } focus:ring-2 focus:outline-none`}
                  />
                  {errors.reason && (
                    <p className="text-xs text-red-500 mt-1">{errors.reason}</p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Отправить на согласование
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
}
