class Message < ApplicationRecord
  belongs_to :user
  belongs_to :chatroom

  has_many_attached :attachments

  validates :content, presence: true, unless: :attachments_attached?

  def attachments_attached?
    attachments.attached?
  end
end
