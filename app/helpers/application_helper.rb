module ApplicationHelper
  def gravatar_url(email, size = 40)
    hash = Digest::MD5.hexdigest(email.downcase)
    "https://www.gravatar.com/avatar/#{hash}?s=#{size}&d=identicon"
  end
end
