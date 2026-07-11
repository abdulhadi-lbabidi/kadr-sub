import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useGetTimes } from '../api/time';
import { useCreateSubscription } from '../api/subscription';
import { CreateSubscriptionInput } from '../types/types';
import LoadingIcon from '../assets/icons/LoadingIcon';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

export default function Subscription() {
  const { t, i18n } = useTranslation();
  const [successMessage, setSuccessMessage] = useState<string>('');

  const today = new Date();

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const isRtl = i18n.language === 'ar';
  const currentDir = isRtl ? 'rtl' : 'ltr';
  const { data: times, isLoading: isLoadingTimes } = useGetTimes();
  const { mutate, isPending } = useCreateSubscription();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors },
  } = useForm<CreateSubscriptionInput>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      time_id: undefined,
      phone_number: '',
      note: '',
    },
  });

  const onSubmit: SubmitHandler<CreateSubscriptionInput> = (data) => {
    setSuccessMessage('');

    const payload = {
      ...data,
      time_id: Number(data.time_id),
    };

    mutate(payload, {
      onSuccess: () => {
        setSuccessMessage(t('subscription.success'));
        reset();
      },
      onError: (error) => {
        if (
          error.response &&
          error.response.status === 422 &&
          error.response.data?.errors
        ) {
          const apiErrors = error.response.data.errors;
          Object.keys(apiErrors).forEach((field) => {
            setError(field as keyof CreateSubscriptionInput, {
              type: 'server',
              message: apiErrors[field][0],
            });
          });
        } else {
          const errorMessage =
            error.response?.data?.message || t('subscription.fallback_error');
          alert(errorMessage);
        }
      },
    });
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-cairo"
      dir={currentDir}
    >
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-2xl w-full border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            {t('subscription.title')}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {t('subscription.subtitle')}
          </p>
        </div>

        {successMessage && (
          <div
            className={`mb-6 p-4 bg-green-50 text-green-700 rounded-md font-medium border-gray-200 border ${
              isRtl
                ? 'border-r-4 border-r-green-500'
                : 'border-l-4 border-l-green-500'
            }`}
          >
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* phone_number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('subscription.phone_label')}
            </label>

            <div className="flex" dir="ltr">
              <Controller
                name="phone_number"
                control={control}
                rules={{
                  required: t('subscription.phone_required'),
                  validate: (value) => {
                    if (!value || value.length < 7) {
                      return (
                        t('subscription.phone_invalid') || 'رقم الهاتف غير صالح'
                      );
                    }
                    return true;
                  },
                }}
                render={({ field }) => {
                  const currentWholeValue = field.value || '';

                  const countries = [
                    {
                      code: '+963',
                      flag: 'https://flagcdn.com/w20/sy.png',
                      name: 'SY',
                    },
                    {
                      code: '+90',
                      flag: 'https://flagcdn.com/w40/tr.png',
                      name: 'TR',
                    },
                    {
                      code: '+961',
                      flag: 'https://flagcdn.com/w40/lb.png',
                      name: 'LB',
                    },
                    {
                      code: '+971',
                      flag: 'https://flagcdn.com/w40/ae.png',
                      name: 'AE',
                    },
                    {
                      code: '+49',
                      flag: 'https://flagcdn.com/w40/de.png',
                      name: 'DE',
                    },
                  ];

                  const selectedCountry =
                    countries.find((c) =>
                      currentWholeValue.startsWith(c.code)
                    ) || countries[0];
                  const currentNumber = currentWholeValue
                    .replace(selectedCountry.code, '')
                    .trim();

                  const handleCountryChange = (
                    e: React.ChangeEvent<HTMLSelectElement>
                  ) => {
                    const newPrefix = e.target.value;
                    field.onChange(`${newPrefix} ${currentNumber}`);
                  };

                  const handleNumberChange = (
                    e: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    const cleanNumber = e.target.value.replace(/\D/g, '');
                    field.onChange(`${selectedCountry.code} ${cleanNumber}`);
                  };

                  return (
                    <div className="w-full flex rounded-lg bg-gray-50 border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all overflow-hidden dynamic-border-color">
                      <style>{`
              .dynamic-border-color {
                border-color: ${errors.phone_number ? '#ef4444' : '#d1d5db'} !important;
              }
            `}</style>

                      <div className="relative flex items-center bg-gray-100 border-r border-gray-300 px-3 gap-2">
                        <img
                          src={selectedCountry.flag}
                          alt={selectedCountry.name}
                          className="w-6 h-4 object-cover rounded-sm shadow-sm border border-gray-200"
                        />
                        <select
                          value={selectedCountry.code}
                          onChange={handleCountryChange}
                          className="bg-transparent text-sm font-medium text-gray-700 outline-none pr-5 cursor-pointer appearance-none"
                          style={{
                            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right center',
                            backgroundSize: '0.8em',
                          }}
                        >
                          {countries.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.name} ({c.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      <input
                        type="tel"
                        value={currentNumber}
                        onChange={handleNumberChange}
                        placeholder={t('subscription.phone_placeholder')}
                        className="w-full h-[46px] px-4 bg-transparent text-left outline-none text-gray-800 font-medium tracking-wide"
                      />
                    </div>
                  );
                }}
              />
            </div>

            {errors.phone_number && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.phone_number.message}
              </p>
            )}
          </div>

          {/* date & time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('subscription.date_label')}
              </label>
              <Controller
                name="date"
                control={control}
                rules={{
                  required: t('subscription.date_required'),
                }}
                render={({ field }) => (
                  // إضافة wrapper لضمان عدم تمدد حقل الديت بيكر خارج المساحة المحددة
                  <div className="w-full">
                    <DatePicker
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date: Date | null) => {
                        field.onChange(
                          date ? date.toISOString().split('T')[0] : ''
                        );
                      }}
                      minDate={new Date()}
                      maxDate={endOfMonth}
                      filterDate={(date) => {
                        const day = date.getDay();
                        return day !== 4 && day !== 5;
                      }}
                      dateFormat="yyyy-MM-dd"
                      placeholderText={t('subscription.date_label')}
                      // توحيد الارتفاع الثابت h-[46px] والـ Focus
                      className={`w-full h-[46px] px-4 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                        errors.date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                )}
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('subscription.time_label')}
              </label>
              <select
                disabled={isLoadingTimes}
                {...register('time_id', {
                  required: t('subscription.time_required'),
                })}
                // توحيد الارتفاع الثابت h-[46px] والـ Focus والـ Padding
                className={`w-full h-[46px] px-4 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none ${
                  errors.time_id ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: isRtl
                    ? 'left 1rem center'
                    : 'right 1rem center',
                  backgroundSize: '1em',
                }}
              >
                <option value="">
                  {isLoadingTimes
                    ? t('subscription.time_loading')
                    : t('subscription.time_select')}
                </option>
                {(Array.isArray(times) ? times : (times as any)?.data)?.map(
                  (time: any) => (
                    <option
                      key={time.id}
                      value={time.id}
                      dir="ltr"
                      className="text-left"
                    >
                      {time.work_time}
                    </option>
                  )
                )}
              </select>
              {errors.time_id && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.time_id.message}
                </p>
              )}
            </div>
          </div>

          {/* notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('subscription.note_label')}
            </label>
            <textarea
              rows={4}
              placeholder={t('subscription.note_placeholder')}
              {...register('note')}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
            ></textarea>
            {errors.note && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.note.message}
              </p>
            )}
          </div>

          {/* submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending || isLoadingTimes}
              className={`w-full h-[48px] px-4 text-white cursor-pointer font-medium rounded-lg text-center transition-all duration-200 ${
                isPending || isLoadingTimes
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-100'
              }`}
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingIcon />
                  {t('subscription.loading_btn')}
                </span>
              ) : (
                t('subscription.submit_btn')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
