module Artists
  class TracksController < ApplicationController
    LIMIT_PER_PAGE = 10

    helper_method :offset

    def index
      tracks = artist.tracks.ordered.offset(offset).limit(LIMIT_PER_PAGE)

      if turbo_frame_request?
        render partial: "artists/tracks/tracks", locals: { tracks:, artist:, current_page:, next_page: }
      else
        render action: :index, locals: { tracks:, artist:, current_page:, next_page:  }
      end
    end

    private

    def artist
      @artist ||= Artist.find(params[:artist_id])
    end

    def current_page
      @current_page ||= params[:page].to_i.zero? ? 1 : params[:page].to_i
    end

    def next_page
      @next_page ||= current_page < artist.tracks.count.to_f / LIMIT_PER_PAGE ? current_page + 1 : nil
    end

    def offset
      @offset ||= LIMIT_PER_PAGE * (current_page - 1)
    end
  end
end
