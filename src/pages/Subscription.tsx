import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useGetTimes } from '../api/time';
import { useCreateSubscription } from '../api/subscription';
import { CreateSubscriptionInput } from '../types/types';
import LoadingIcon from '../assets/icons/LoadingIcon';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { ar } from 'date-fns/locale/ar';
import { registerLocale } from 'react-datepicker';

registerLocale('ar', ar);

export default function Subscription() {
  const { t, i18n } = useTranslation();
  const [successMessage, setSuccessMessage] = useState<string>('');

  const today = new Date();
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

  const inputBaseStyle = `w-full h-[46px] px-4 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-gray-800`;

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 sm:px-6 font-cairo"
      dir={currentDir}
    >
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-5 sm:p-8 border border-gray-100">
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/*  phone */}
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
                    if (!value || value.length < 9) {
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
                      code: '00963',
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

                  const currentNumber = currentWholeValue.replace(
                    selectedCountry.code,
                    ''
                  );

                  const handleCountryChange = (
                    e: React.ChangeEvent<HTMLSelectElement>
                  ) => {
                    const newPrefix = e.target.value;
                    field.onChange(`${newPrefix}${currentNumber}`);
                  };

                  const handleNumberChange = (
                    e: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    let cleanNumber = e.target.value.replace(/\D/g, '');

                    if (selectedCountry.code === '+9639') {
                      if (cleanNumber.startsWith('09')) {
                        cleanNumber = cleanNumber.substring(2);
                      } else if (
                        cleanNumber.startsWith('9') ||
                        cleanNumber.startsWith('0')
                      ) {
                        cleanNumber = cleanNumber.substring(1);
                      }
                    } else {
                      if (cleanNumber.startsWith('0')) {
                        cleanNumber = cleanNumber.substring(1);
                      }
                    }

                    field.onChange(`${selectedCountry.code}${cleanNumber}`);
                  };

                  return (
                    <div
                      className={`w-full flex rounded-lg overflow-hidden bg-gray-50 border h-[46px] focus-within:ring-2 focus-within:ring-blue-500 transition-all ${
                        errors.phone_number
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {/* country picker */}
                      <div className="flex items-center bg-gray-100 px-3 border-r border-gray-300 gap-1.5 shrink-0">
                        <img
                          src={selectedCountry.flag}
                          alt={selectedCountry.name}
                          className="w-5 h-3.5 object-cover rounded-sm border border-gray-200"
                        />
                        <select
                          value={selectedCountry.code}
                          onChange={handleCountryChange}
                          className="bg-transparent text-xs font-semibold text-gray-700 outline-none pr-4 cursor-pointer appearance-none"
                          style={{
                            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right center',
                            backgroundSize: '0.7em',
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
                        placeholder={
                          selectedCountry.code === '00963'
                            ? '9xxx xxx xx'
                            : t('subscription.phone_placeholder')
                        }
                        className="w-full h-full px-4 bg-transparent outline-none text-gray-800 font-medium"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/*  date */}
            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('subscription.date_label')}
              </label>
              <Controller
                name="date"
                control={control}
                rules={{ required: t('subscription.date_required') }}
                render={({ field }) => (
                  <div className="w-full style-datepicker-wrapper">
                    <DatePicker
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date: Date | null) => {
                        field.onChange(
                          date ? date.toISOString().split('T')[0] : ''
                        );
                      }}
                      locale={isRtl ? 'ar' : undefined}
                      minDate={new Date()}
                      maxDate={endOfMonth}
                      filterDate={(date) => {
                        const day = date.getDay();
                        return day !== 4 && day !== 5;
                      }}
                      dateFormat="yyyy-MM-dd"
                      placeholderText={t('subscription.date_label')}
                      className={`${inputBaseStyle} ${
                        errors.date ? 'border-red-500' : 'border-gray-300'
                      }`}
                      wrapperClassName="w-full"
                    />
                  </div>
                )}
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/*  time */}
            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('subscription.time_label')}
              </label>
              <div className="relative w-full">
                <select
                  disabled={isLoadingTimes}
                  {...register('time_id', {
                    required: t('subscription.time_required'),
                  })}
                  className={`${inputBaseStyle} ${
                    errors.time_id ? 'border-red-500' : 'border-gray-300'
                  } appearance-none pr-10 pl-4`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: isRtl
                      ? 'left 1rem center'
                      : 'right 1rem center',
                    backgroundSize: '0.9em',
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
              </div>
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
              rows={3}
              placeholder={t('subscription.note_placeholder')}
              {...register('note')}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none font-medium text-gray-800"
            ></textarea>
            {errors.note && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.note.message}
              </p>
            )}
          </div>

          {/*  submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending || isLoadingTimes}
              className={`w-full h-[48px] px-4 text-white cursor-pointer font-semibold rounded-lg text-center transition-all duration-200 ${
                isPending || isLoadingTimes
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] shadow-md'
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
