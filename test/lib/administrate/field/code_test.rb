require 'test_helper'

module Administrate
  module Field
    class CodeTest < Minitest::Test
      def test_that_it_has_a_version_number
        refute_nil Administrate::Field::Code::VERSION
      end

      def test_it_returns_the_code
        code = '<script>function noop()</script>'
        field = Administrate::Field::Code.new(:tracking_pixel, code, :show)
        assert_equal code, field.data
      end

      def test_has_the_correct_partial
        %i[show index form].each do |page|
          code = '<script>function noop()</script>'
          field = Administrate::Field::Code.new(:tracking_pixel, code, page)
          partial_path = field.to_partial_path

          assert_equal "/fields/code/#{page}", partial_path
        end
      end
    end
  end
end
