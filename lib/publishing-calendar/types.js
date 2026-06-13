/** @typedef {'build'|'ai'|'grow'|'proof'} BrandId */

/**
 * @typedef {Object} TaskPanelState
 * @property {string} [prompt_override]
 * @property {string} [notes]
 * @property {'Missing'|'Generated'|'Added'|'Verified'|'Not Required'} cta_status
 * @property {string} [cta_placement]
 * @property {Record<string, string>} checklist
 * @property {Record<string, string>} panel_fields
 * @property {string} verification_status
 * @property {string} [proof_upload_note]
 * @property {string} [published_by]
 * @property {string} [platform_opened_at]
 * @property {string} workflow_step
 * @property {string} [last_updated_at]
 */

/**
 * @typedef {Object} PublishingCalendarTask
 * @property {string} id
 * @property {string} brand
 * @property {string} brand_shortcut
 * @property {BrandId} brand_id
 * @property {string} campaign_topic
 * @property {string} topic_type
 * @property {string} systems_relevance
 * @property {string} primary_audience
 * @property {string} primary_asset
 * @property {string} campaign_intensity
 * @property {string} default_cta
 * @property {string} research_needed
 * @property {string} evidence_uncertainty_note
 * @property {number} day_number
 * @property {string} phase
 * @property {string} channel
 * @property {string} channel_type
 * @property {string} format_family
 * @property {string} content_medium
 * @property {string} objective
 * @property {string} slot
 * @property {string} production_date
 * @property {string} publishing_date
 * @property {string} scheduled_time
 * @property {string} timezone
 * @property {string} what_to_post
 * @property {string} seo_ai_search_terms
 * @property {string} cta_link
 * @property {string} cta
 * @property {string} follow_up_comment_action
 * @property {string} compliance_note
 * @property {string} source_control_reminder
 * @property {string} task_title
 * @property {string} production_panel_id
 * @property {TaskPanelState} panel_state
 * @property {string} production_status
 * @property {string} publishing_status
 * @property {string} task_status
 * @property {string} [published_url]
 * @property {string} [generation_slot_date]
 * @property {number} [lead_time_days]
 * @property {string} created_at
 */

/**
 * @typedef {Object} CalendarActivityItem
 * @property {string} id
 * @property {string} action
 * @property {string} task_id
 * @property {string} created_at
 */

/**
 * @typedef {Object} PublishingCalendarData
 * @property {PublishingCalendarTask[]} tasks
 * @property {CalendarActivityItem[]} activity
 * @property {Object} schedulingConfig
 * @property {string} updatedAt
 */

export const WORKFLOW_STEPS = [
  "Scheduled",
  "In Production",
  "Draft Saved",
  "Asset Ready",
  "Ready to Publish",
  "Time to Post",
  "Posted",
  "Completed",
  "Missed",
];

export const STORAGE_KEYS = {
  tasks: "zar_publishing_calendar_tasks",
  activity: "zar_publishing_calendar_activity",
  updatedAt: "zar_publishing_calendar_updated_at",
  schedulingConfig: "zar_publishing_calendar_scheduling_config",
};
