require 'test_helper'

module Administrate
  module Field
    class LazyBelongsToTest < Minitest::Test
      def test_that_it_has_a_version_number
        refute_nil Administrate::Field::LazyBelongsTo::VERSION
      end

      def test_has_the_correct_partial
        %i[show index form].each do |page|
          field = Administrate::Field::LazyBelongsTo.new(:association, nil, page)
          partial_path = field.to_partial_path

          assert_equal "/fields/lazy_belongs_to/#{page}", partial_path
        end
      end
    end
  end
end
