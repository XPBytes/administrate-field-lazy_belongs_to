require 'administrate/field/belongs_to'
require 'administrate/field/lazy_belongs_to/version'
require 'rails/engine'
require 'administrate/engine'

module Administrate
  module Field
    class LazyBelongsTo < Administrate::Field::BelongsTo
      include LazyBelongsToVersion

      class Engine < ::Rails::Engine
        Administrate::Engine.add_javascript 'administrate-field-lazy_belongs_to/application'
        Administrate::Engine.add_stylesheet 'administrate-field-lazy_belongs_to/application'

        isolate_namespace Administrate
      end

      def to_s
        data
      end

      def display_placeholder
        options.fetch(:placeholder) do
          format('Select a %<association>s', association: associated_class.name)
        end
      end

      def current_value
        data ? display_associated_resource : display_placeholder
      end

      def templated_action
        options.fetch(:action).call(self, q: '{q}')
      end

      def value_attribute
        options.fetch(:value_attribute) { 'id' }
      end

      def label_attribute
        options.fetch(:label_attribute) { 'name' }
      end

      def size
        options.fetch(:size) { 10 }
      end

      def url_helpers
        Rails.application.routes.url_helpers
      end
    end
  end
end
