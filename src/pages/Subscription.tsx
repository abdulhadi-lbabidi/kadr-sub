import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useGetTimes } from '../api/time';
import { useCreateSubscription } from '../api/subscription';
import { CreateSubscriptionInput } from '../types/types';
import LoadingIcon from '../assets/icons/LoadingIcon';

export default function Subscription() {
  const { t, i18n } = useTranslation();
  const [successMessage, setSuccessMessage] = useState<string>('');

  const isRtl = i18n.language === 'ar';
  const currentDir = isRtl ? 'rtl' : 'ltr';

  const { data: times, isLoading: isLoadingTimes } = useGetTimes();

  const { mutate, isPending } = useCreateSubscription();

  const {
    register,
    handleSubmit,
    reset,
    setError,
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
            <input
              type="tel"
              placeholder={t('subscription.phone_placeholder')}
              {...register('phone_number', {
                required: t('subscription.phone_required'),
              })}
              className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.phone_number ? 'border-red-500' : 'border-gray-300'
              } ${isRtl ? 'text-right' : 'text-left'}`}
            />
            {errors.phone_number && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.phone_number.message}
              </p>
            )}
          </div>

          {/* date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('subscription.date_label')}
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                {...register('date', {
                  required: t('subscription.date_required'),
                })}
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('subscription.time_label')}
              </label>
              <select
                disabled={isLoadingTimes}
                {...register('time_id', {
                  required: t('subscription.time_required'),
                })}
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.time_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">
                  {isLoadingTimes
                    ? t('subscription.time_loading')
                    : t('subscription.time_select')}
                </option>
                {times?.map((time) => (
                  <option key={time.id} value={time.id}>
                    {time.work_time}
                  </option>
                ))}
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
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
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
              className={`w-full py-3 px-4 text-white cursor-pointer font-medium rounded-lg text-center transition-all duration-200 ${
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
