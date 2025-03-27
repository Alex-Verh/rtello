class ProcessDashboardBackgroundJob < ApplicationJob
  queue_as :carrierwave # this job will be enqueued in the carrierwave queue

  def perform(*args)
    dashboard = Dashboard.find(dashboard_id)
    return unless dashboard&.background_image? # stop if no dashboard or image
    dashboard.background_image.recreate_versions! if dashboard.background_image?
  end
end
